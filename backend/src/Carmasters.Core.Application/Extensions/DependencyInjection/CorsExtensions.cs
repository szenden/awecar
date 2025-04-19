using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Carmasters.Core.Application.Extensions.DependencyInjection
{
    public static class CorsExtensions
    {
        public static IServiceCollection AddCorsToApp(this IServiceCollection services, IConfiguration configuration)
        {
            
            return services.AddCors(options =>
            {
                void policyDefaults(CorsPolicyBuilder policy, string host)
                {
                    if (host == "*")
                    {
                        policy.SetIsOriginAllowed(x => true);
                    }
                    else
                    { 
                        policy.SetIsOriginAllowed(origin => new Uri(origin).Host == host);
                    } 
                    policy.WithHeaders("Content-Type", "Authorization");
                    policy.WithMethods("GET", "PUT", "POST", "DELETE", "OPTIONS");
                }
                var appHost = configuration.GetSection("Cors:AppHost").Value;
                if (string.IsNullOrWhiteSpace(appHost)) throw new Exception("Cors host not configured.");

                options.AddPolicy("localhost-dev", policy => policyDefaults(policy, "localhost"));
                options.AddPolicy("production", policy => policyDefaults(policy, appHost));
            });
        }
    }
}
