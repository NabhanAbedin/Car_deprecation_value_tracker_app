using System.Security.Cryptography;

namespace CarDepreciationApi.middleware;

public class GatewaySecretMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string _expectedSecret;

    public GatewaySecretMiddleware(RequestDelegate next, IConfiguration config)
    {
        _next = next;
        _expectedSecret = Environment.GetEnvironmentVariable("GATEWAY_SECRET") ??
                          throw new InvalidOperationException("gateway variable is not set");
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var incomingSecret = context.Request.Headers["x-gateway-secret"];

        if (string.IsNullOrEmpty(incomingSecret) || !CryptographicEquals(incomingSecret, _expectedSecret))
        {
            context.Response.StatusCode = 403;
            return;
        }

        await _next(context);
    }

    private static bool CryptographicEquals(string incoming, string expected)
    {
        return CryptographicOperations.FixedTimeEquals(
            System.Text.Encoding.UTF8.GetBytes(incoming),
            System.Text.Encoding.UTF8.GetBytes(expected)
        );
    }
}