using Microsoft.Extensions.Options;
using Payroll.WebApp.Common;

namespace Payroll.WebApp.Middleware
{
    //AS OF NOW I AM ADDING IN COMMIT FOR FUTURE USE 
    //CURRENTLY USING _Layout.cshtml Script for Disable Multiple TAB
    // DATE 06-08-2025
    public class SingleTabRestrictionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly List<string> _restrictedUrls;

        public SingleTabRestrictionMiddleware(RequestDelegate next, IOptions<RestrictedUrlSettings> options)
        {
            _next = next;
            _restrictedUrls = options.Value.RestrictedUrls;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value;
            if (_restrictedUrls.Any(u => path.Equals(u, StringComparison.OrdinalIgnoreCase)))
            {
                var key = $"TabOpen_{path}";
                var isTabOpen = context.Session.GetString(key);
                if (!string.IsNullOrEmpty(isTabOpen))
                {
                    context.Response.Redirect("/Base/UrlRestricted");
                    return;
                }           
                context.Session.SetString(key, "true");
                context.Response.OnStarting(() =>
                {
                    context.Session.Remove(key);
                    return Task.CompletedTask;
                });
            }
            await _next(context);
        }
    }
}