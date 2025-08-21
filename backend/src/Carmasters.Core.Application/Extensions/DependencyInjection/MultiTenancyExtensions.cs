using Carmasters.Core.Application.Middleware;
using Carmasters.Core.Application.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Carmasters.Core.Application.Extensions.DependencyInjection
{
    public static class MultiTenancyExtensions
    {
        public static IServiceCollection AddMultiTenancy(this IServiceCollection services)
        {
            services.AddScoped<ITenantContext, TenantContext>();
            services.AddScoped<ITenantRepository, TenantRepository>();
            
            return services;
        }

        public static IApplicationBuilder UseMultiTenancy(this IApplicationBuilder app)
        {
            app.UseMiddleware<TenantResolutionMiddleware>();
            return app;
        }
    }
}