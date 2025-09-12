# new-website-project

🎸 Backend – Guitar Lessons API

This is the ASP.NET Core Web API for the Guitar Lessons project.
It provides video listings, order handling, Stripe payments, and email notifications.

⚙️ Requirements

.NET 9 SDK

SQL Server Express (or SQL Server)

Stripe CLI (for local webhook forwarding)

SendGrid account (for email delivery)

🚀 Running the API

Update the database

cd src/GuitarLessons.Api
dotnet ef database update


Run the API

dotnet run


Swagger UI → https://localhost:7182/swagger

💳 Stripe Webhook (for local testing)

Open a second terminal and run:

stripe listen --forward-to https://localhost:7182/webhook


This lets Stripe forward events (payment succeeded, checkout completed) to your local API.

Copy the whsec_... value from the CLI and update it in appsettings.json.

📚 Available Endpoints
Public

GET /videos → List available videos

POST /orders → Create a new order

POST /create-checkout-session/{orderId} → Create Stripe Checkout session

Admin (requires X-Admin-Key header)

GET /admin/videos → List all videos

POST /admin/videos → Add a video

PUT /admin/videos/{id} → Update video

DELETE /admin/videos/{id} → Delete video

GET /admin/orders → List all orders

📧 Emails

When an order is paid:

Buyer receives a confirmation email with the video link.

Tutor receives an order notification email.

Emails are sent using SendGrid
.

📝 Notes for Frontend Dev

Use the Swagger UI to explore endpoints.

To create a payment:

Call POST /orders with customer details + video id.

Call POST /create-checkout-session/{orderId} → get sessionUrl.

Redirect user to sessionUrl.

After payment, webhook updates the DB and sends emails.