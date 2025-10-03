using System.Text;
using System.Security.Claims;
   // ✅ TokenValidationParameters, SecurityAlgorithms

using GuitarLessons.Application.DTOs;
using GuitarLessons.Domain.Entities;
using GuitarLessons.Infrastructure.Persistence;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using SendGrid;
using SendGrid.Helpers.Mail;

using Stripe;
using Stripe.Checkout;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;


var builder = WebApplication.CreateBuilder(args);

// Swagger & minimal APIs
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Guitar Lessons API",
        Version = "v1"
    });

    // 🔑 Add JWT Authentication to Swagger
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token.\r\n\r\nExample: \"Bearer eyJhbGciOi...\""
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});


// EF Core (SQL Server)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// JWT Auth
builder.Services.AddAuthorization();
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
    };
});

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

// Authz middlewares should appear before endpoints
app.UseAuthentication();
app.UseAuthorization();

// --------------------- PUBLIC: VIDEOS ---------------------

app.MapGet("/videos", async (AppDbContext db) =>
{
    return await db.Videos.ToListAsync();
});

// --------------------- PUBLIC: ORDERS (create only) ---------------------

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

// (Removed the public GET /orders listing to avoid exposing data)

// --------------------- STRIPE CHECKOUT ---------------------

app.MapPost("/create-checkout-session/{orderId}", async (Guid orderId, AppDbContext db) =>
{
    var order = await db.Orders.Include(o => o.Video).FirstOrDefaultAsync(o => o.Id == orderId);
    if (order == null)
    {
        return Results.NotFound("Order not found");
    }

    var domain = "https://localhost:7182"; // TODO: replace with your frontend domain

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
        Metadata = new Dictionary<string, string> { { "orderId", order.Id.ToString() } }
    };

    var service = new SessionService();
    var session = service.Create(options);

    return Results.Ok(new { sessionUrl = session.Url });
});

// --------------------- STRIPE WEBHOOK ---------------------

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

        var stripeEvent = EventUtility.ConstructEvent(
            json,
            request.Headers["Stripe-Signature"],
            webhookSecret
        );

        if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
        {
            var session = stripeEvent.Data.Object as Session;
            if (session == null) return Results.Ok();

            if (session.Metadata == null || !session.Metadata.ContainsKey("orderId")) return Results.Ok();
            if (!Guid.TryParse(session.Metadata["orderId"], out var orderId)) return Results.Ok();

            var order = await db.Orders.Include(o => o.Video).FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null) return Results.Ok();

            if (!order.IsPaid)
            {
                order.IsPaid = true;
                await db.SaveChangesAsync();

                // Send emails
                var shopName = config["Branding:ShopName"] ?? "Guitar Lessons Shop";
                var baseUrl = config["Delivery:VideoBaseUrl"]?.TrimEnd('/') ?? "";
                var storagePath = order.Video.StoragePath?.TrimStart('/') ?? "";
                var videoUrl = string.IsNullOrEmpty(baseUrl) ? order.Video.StoragePath : $"{baseUrl}/{storagePath}";

                var buyerHtml = $@"
<html>
  <body style=""font-family: Arial, sans-serif; background:#f6f7fb; padding:24px;"">
    <div style=""max-width:520px; margin:0 auto; background:#ffffff; border-radius:12px; padding:24px; box-shadow:0 10px 25px rgba(0,0,0,0.06;"">
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

                var tutorHtml = $@"
<html>
  <body style=""font-family: Arial, sans-serif; background:#f6f7fb; padding:24px;"">
    <div style=""max-width:520px; margin:0 auto; background:#ffffff; border-radius:12px; padding:24px; box-shadow:0 10px 25px rgba(0,0,0,0.06;"">
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

                    var buyerMsg = new SendGridMessage
                    {
                        From = new EmailAddress(fromEmail, shopName),
                        Subject = $"Your {shopName} Purchase 🎸",
                        PlainTextContent = $"Thanks {order.CustomerName}! Here’s your video: {videoUrl}",
                        HtmlContent = buyerHtml
                    };
                    buyerMsg.AddTo(order.CustomerEmail);
                    await client.SendEmailAsync(buyerMsg);

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

// --------------------- AUTH ---------------------

app.MapPost("/auth/register", async (
    [FromBody] RegisterDto dto,
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole> roleManager) =>
{
    var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email };
    var result = await userManager.CreateAsync(user, dto.Password);

    if (!result.Succeeded)
        return Results.BadRequest(result.Errors);

    if (!await roleManager.RoleExistsAsync("Admin"))
        await roleManager.CreateAsync(new IdentityRole("Admin"));

    await userManager.AddToRoleAsync(user, "Admin");

    return Results.Ok("User registered as Admin.");
});

app.MapPost("/auth/login", async (
    [FromBody] LoginDto dto,
    UserManager<ApplicationUser> userManager,
    IConfiguration config,
    SignInManager<ApplicationUser> signInManager) =>
{
    var user = await userManager.FindByEmailAsync(dto.Email);
    if (user == null) return Results.BadRequest("Invalid login");

    var result = await signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
    if (!result.Succeeded) return Results.BadRequest("Invalid login");

    var authClaims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.UserName!),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var roles = await userManager.GetRolesAsync(user);
    foreach (var role in roles)
        authClaims.Add(new Claim(ClaimTypes.Role, role));

    var jwt = config.GetSection("Jwt");
    var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));

    var token = new JwtSecurityToken(
        issuer: jwt["Issuer"],
        audience: jwt["Audience"],
        expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwt["ExpireMinutes"])),
        claims: authClaims,
        signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
    );

    return Results.Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
});

// --------------------- ADMIN (JWT Protected) ---------------------

var admin = app.MapGroup("/admin").RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });

admin.MapGet("/videos", async (AppDbContext db) =>
{
    return await db.Videos.OrderBy(v => v.Title).ToListAsync();
}).WithOpenApi(o => { o.Summary = "List all videos (admin)"; return o; });

admin.MapPost("/videos", async (CreateVideoDto dto, AppDbContext db) =>
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

admin.MapPut("/videos/{id:guid}", async (Guid id, UpdateVideoDto dto, AppDbContext db) =>
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

admin.MapDelete("/videos/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var video = await db.Videos.FindAsync(id);
    if (video == null) return Results.NotFound();

    db.Videos.Remove(video);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithOpenApi(o => { o.Summary = "Delete a video (admin)"; return o; });

admin.MapGet("/orders", async (AppDbContext db) =>
{
    return await db.Orders
        .Include(o => o.Video)
        .OrderByDescending(o => o.CreatedAt)
        .ToListAsync();
}).WithOpenApi(o => { o.Summary = "List all orders (admin)"; return o; });

app.Run();
