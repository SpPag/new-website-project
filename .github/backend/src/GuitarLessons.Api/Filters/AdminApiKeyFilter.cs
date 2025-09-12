namespace GuitarLessons.Api.Filters
{
    using Microsoft.AspNetCore.Http;

    namespace GuitarLessons.Api.Filters
    {
        public class AdminApiKeyFilter : IEndpointFilter
        {
            private readonly IConfiguration _config;
            public AdminApiKeyFilter(IConfiguration config) => _config = config;

            public async ValueTask<object> InvokeAsync(
                EndpointFilterInvocationContext context,
                EndpointFilterDelegate next)
            {
                var req = context.HttpContext.Request;

                if (!req.Headers.TryGetValue("X-Admin-Key", out var provided) || string.IsNullOrWhiteSpace(provided))
                    return Results.Unauthorized();

                var expected = _config["Admin:ApiKey"];
                if (string.IsNullOrWhiteSpace(expected) || !string.Equals(provided, expected, StringComparison.Ordinal))
                    return Results.Unauthorized();

                return await next(context);
            }
        }
    }

}
