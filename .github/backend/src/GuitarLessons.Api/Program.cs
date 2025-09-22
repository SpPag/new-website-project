using System.IO;
using GuitarLessons.Application.DTOs;
using GuitarLessons.Domain.Entities;
using GuitarLessons.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SendGrid;
using SendGrid.Helpers.Mail;
using Stripe;               // ✅ needed for Events and StripeConfiguration
using Stripe.Checkout;      // ✅ needed for Session
using GuitarLessons.Api.Filters;
using GuitarLessons.Api.Filters.GuitarLessons.Api.Filters;

var builder = WebApplication.CreateBuilder(args);

// Swagger & minimal APIs
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<AdminApiKeyFilter>();


// EF Core (SQL Server)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Initialize Stripe with secret key from config
StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

var app = builder.Build();

// Migrate & seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    DbSeeder.Seed(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --------------------- VIDEOS ---------------------

// GET /videos
app.MapGet("/videos", async (AppDbContext db) =>
{
    return await db.Videos.ToListAsync();
});

// --------------------- ORDERS ---------------------

// POST /orders
app.MapPost("/orders", async (CreateOrderDto dto, AppDbContext db) =>
{
    var video = await db.Videos.FindAsync(dto.VideoId);
    if (video == null)
    {
        return Results.NotFound("Video not found");
    }

    var order = new Order
    {
        CustomerName = dto.CustomerName,
        CustomerEmail = dto.CustomerEmail,
        VideoId = video.Id,
        Video = video,
        Amount = video.Price,
        IsPaid = false
    };

    db.Orders.Add(order);
    await db.SaveChangesAsync();

    var orderDto = new OrderDto
    {
        Id = order.Id,
        CustomerName = order.CustomerName,
        CustomerEmail = order.CustomerEmail,
        VideoId = order.VideoId,
        Amount = order.Amount,
        IsPaid = order.IsPaid,
        CreatedAt = order.CreatedAt
    };

    return Results.Created($"/orders/{order.Id}", orderDto);
});

// GET /orders  (admin/testing; we’ll secure later)
app.MapGet("/orders", async (AppDbContext db) =>
{
    return await db.Orders
        .Include(o => o.Video)
        .Select(o => new OrderDto
        {
            Id = o.Id,
            CustomerName = o.CustomerName,
            CustomerEmail = o.CustomerEmail,
            VideoId = o.VideoId,
            Amount = o.Amount,
            IsPaid = o.IsPaid,
            CreatedAt = o.CreatedAt
        })
        .ToListAsync();
});

// --------------------- STRIPE CHECKOUT ---------------------

// POST /create-checkout-session/{orderId}
app.MapPost("/create-checkout-session/{orderId}", async (Guid orderId, AppDbContext db) =>
{
    var order = await db.Orders.Include(o => o.Video).FirstOrDefaultAsync(o => o.Id == orderId);
    if (order == null)
    {
        return Results.NotFound("Order not found");
    }

    // ⚠️ Replace with your real frontend domain later
    var domain = "https://localhost:7182";

    var options = new SessionCreateOptions
    {
        PaymentMethodTypes = new List<string> { "card" },
        LineItems = new List<SessionLineItemOptions>
        {
            new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    Currency = "eur",
                    // You can also use UnitAmount (long); UnitAmountDecimal is fine too
                    UnitAmountDecimal = order.Amount * 100, // cents
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = order.Video.Title,
                        Description = order.Video.Description
                    }
                },
                Quantity = 1
            }
        },
        Mode = "payment",
        SuccessUrl = $"{domain}/success?orderId={order.Id}",
        CancelUrl = $"{domain}/cancel",
        // ✅ Store order id so webhook can find it later
        Metadata = new Dictionary<string, string>
        {
            { "orderId", order.Id.ToString() }
        }
    };

    var service = new SessionService();
    var session = service.Create(options);

    return Results.Ok(new { sessionUrl = session.Url });
});

// --------------------- STRIPE WEBHOOK ---------------------

// POST /webhook
app.MapPost("/webhook", async (HttpRequest request, AppDbContext db, IConfiguration config) =>
{
    var json = await new StreamReader(request.Body).ReadToEndAsync();

    try
    {
        var webhookSecret = config["Stripe:WebhookSecret"];
        if (string.IsNullOrWhiteSpace(webhookSecret))
        {
            app.Logger.LogError("Stripe WebhookSecret is missing from configuration.");
            return Results.BadRequest("Webhook secret not configured");
        }

        // Verify signature
        var stripeEvent = EventUtility.ConstructEvent(
            json,
            request.Headers["Stripe-Signature"],
            webhookSecret
        );

        // Handle only checkout.session.completed for now
        if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
        {
            var session = stripeEvent.Data.Object as Session;
            if (session == null)
            {
                app.Logger.LogWarning("Webhook received but Session was null.");
                return Results.Ok();
            }

            if (session.Metadata == null || !session.Metadata.ContainsKey("orderId"))
            {
                app.Logger.LogWarning("Webhook Session has no orderId metadata.");
                return Results.Ok();
            }

            if (!Guid.TryParse(session.Metadata["orderId"], out var orderId))
            {
                app.Logger.LogWarning("Webhook orderId metadata is not a valid GUID.");
                return Results.Ok();
            }

            var order = await db.Orders.Include(o => o.Video).FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null)
            {
                app.Logger.LogWarning("Webhook found no matching order for {OrderId}", orderId);
                return Results.Ok();
            }

            // Idempotency: only update if not already paid
            if (!order.IsPaid)
            {
                order.IsPaid = true;
                await db.SaveChangesAsync();

                // Send emails
                var shopName = config["Branding:ShopName"] ?? "Guitar Lessons Shop";
                // Build full video URL (using Delivery:VideoBaseUrl if configured)
                var baseUrl = config["Delivery:VideoBaseUrl"]?.TrimEnd('/') ?? "";
                var storagePath = order.Video.StoragePath?.TrimStart('/') ?? "";
                var videoUrl = string.IsNullOrEmpty(baseUrl) ? order.Video.StoragePath : $"{baseUrl}/{storagePath}";
                // Buyer email HTML
                var buyerHtml = $@"
<html>
  <body style=""font-family: Arial, sans-serif; background:#f6f7fb; padding:24px;"">
    <div style=""max-width:520px; margin:0 auto; background:#ffffff; border-radius:12px; padding:24px; box-shadow:0 10px 25px rgba(0,0,0,0.06);"">
      <h2 style=""margin-top:0; color:#111;"">Thank you, {order.CustomerName}! 🎶</h2>
      <p>Your purchase was successful. Click the button below to watch your lesson:</p>
      <p style=""margin:28px 0;"">
        <a href=""{videoUrl}"" style=""display:inline-block; padding:12px 18px; border-radius:10px; text-decoration:none; background:#111; color:#fff; font-weight:600;"">▶️ Watch Your Lesson</a>
      </p>
      <p style=""color:#555; font-size:14px;"">If the button doesn’t work, copy this link:<br/>
        <a href=""{videoUrl}"">{videoUrl}</a>
      </p>
      <hr style=""border:none; border-top:1px solid #eee; margin:24px 0;""/>
      <p style=""color:#777; font-size:12px;"">Order ID: {order.Id}<br/>Amount: {order.Amount} EUR</p>
    </div>
  </body>
</html>";

                // Tutor email HTML
                var tutorHtml = $@"
<html>
  <body style=""font-family: Arial, sans-serif; background:#f6f7fb; padding:24px;"">
    <div style=""max-width:520px; margin:0 auto; background:#ffffff; border-radius:12px; padding:24px; box-shadow:0 10px 25px rgba(0,0,0,0.06);"">
      <h2 style=""margin-top:0; color:#111;"">New Order Paid 🎉</h2>
      <p><strong>Customer:</strong> {order.CustomerName} ({order.CustomerEmail})</p>
      <p><strong>Video:</strong> {order.Video.Title}</p>
      <p><strong>Amount:</strong> {order.Amount} EUR</p>
      <p><strong>Order ID:</strong> {order.Id}</p>
      <p><strong>Link:</strong> <a href=""{videoUrl}"">{videoUrl}</a></p>
    </div>
  </body>
</html>";



                var sendGridApiKey = config["SendGrid:ApiKey"];
                var fromEmail = config["SendGrid:FromEmail"];
                if (!string.IsNullOrWhiteSpace(sendGridApiKey) && !string.IsNullOrWhiteSpace(fromEmail))
                {
                    var client = new SendGridClient(sendGridApiKey);

                    // Buyer email
                    var buyerMsg = new SendGridMessage
                    {
                        From = new EmailAddress(fromEmail, shopName),
                        Subject = $"Your {shopName} Purchase 🎸",
                        PlainTextContent = $"Thanks {order.CustomerName}! Here’s your video: {videoUrl}",
                        HtmlContent = buyerHtml
                    };
                    buyerMsg.AddTo(order.CustomerEmail);
                    await client.SendEmailAsync(buyerMsg);

                    // Tutor email (send to same fromEmail for now; replace with tutor’s email later)
                    var tutorMsg = new SendGridMessage
                    {
                        From = new EmailAddress(fromEmail, shopName),
                        Subject = $"New {shopName} Order Received",
                        PlainTextContent = $"Order {order.Id} paid by {order.CustomerName} ({order.CustomerEmail}). Video: {order.Video.Title} for {order.Amount} EUR. Link: {videoUrl}",
                        HtmlContent = tutorHtml
                    };
                    tutorMsg.AddTo(fromEmail);
                    await client.SendEmailAsync(tutorMsg);
                }
                else
                {
                    app.Logger.LogWarning("SendGrid not configured; skipping emails.");
                }
            }
        }

        return Results.Ok();
    }
    catch (StripeException e)
    {
        app.Logger.LogError(e, "Stripe webhook error: {Message}", e.Message);
        return Results.BadRequest(e.Message);
    }
});


var admin = app.MapGroup("/admin");
admin.AddEndpointFilter<AdminApiKeyFilter>();

// NOTE: we add a dummy header parameter so Swagger shows an input box for X-Admin-Key
admin.MapGet("/videos", async ([FromHeader(Name = "X-Admin-Key")] string adminKey, AppDbContext db) =>
{
    return await db.Videos.OrderBy(v => v.Title).ToListAsync();
}).WithOpenApi(o => { o.Summary = "List all videos (admin)"; return o; });

admin.MapPost("/videos", async ([FromHeader(Name = "X-Admin-Key")] string adminKey, CreateVideoDto dto, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.StoragePath))
        return Results.BadRequest("Title and StoragePath are required.");

    var video = new Video
    {
        Title = dto.Title.Trim(),
        Description = dto.Description?.Trim() ?? "",
        Price = dto.Price,
        StoragePath = dto.StoragePath.Trim(),
        PreviewUrl = string.IsNullOrWhiteSpace(dto.PreviewUrl) ? null : dto.PreviewUrl.Trim()
    };

    db.Videos.Add(video);
    await db.SaveChangesAsync();
    return Results.Created($"/admin/videos/{video.Id}", video);
}).WithOpenApi(o => { o.Summary = "Create a new video (admin)"; return o; });

admin.MapPut("/videos/{id:guid}", async ([FromHeader(Name = "X-Admin-Key")] string adminKey, Guid id, UpdateVideoDto dto, AppDbContext db) =>
{
    var video = await db.Videos.FindAsync(id);
    if (video == null) return Results.NotFound();

    video.Title = dto.Title?.Trim() ?? video.Title;
    video.Description = dto.Description?.Trim() ?? video.Description;
    video.Price = dto.Price;
    video.StoragePath = dto.StoragePath?.Trim() ?? video.StoragePath;
    video.PreviewUrl = string.IsNullOrWhiteSpace(dto.PreviewUrl) ? null : dto.PreviewUrl.Trim();

    await db.SaveChangesAsync();
    return Results.Ok(video);
}).WithOpenApi(o => { o.Summary = "Update a video (admin)"; return o; });

admin.MapDelete("/videos/{id:guid}", async ([FromHeader(Name = "X-Admin-Key")] string adminKey, Guid id, AppDbContext db) =>
{
    var video = await db.Videos.FindAsync(id);
    if (video == null) return Results.NotFound();

    db.Videos.Remove(video);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithOpenApi(o => { o.Summary = "Delete a video (admin)"; return o; });

// (Optional) list orders for admin
admin.MapGet("/orders", async ([FromHeader(Name = "X-Admin-Key")] string adminKey, AppDbContext db) =>
{
    return await db.Orders
        .Include(o => o.Video)
        .OrderByDescending(o => o.CreatedAt)
        .ToListAsync();
}).WithOpenApi(o => { o.Summary = "List all orders (admin)"; return o; });


app.Run();
