using System;
using System.Linq;
using System.Threading.Tasks;
using Carmasters.Core.Application.Services;
using Carmasters.Core.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Carmasters.Core.Application.Middleware
{
    public class TenantResolutionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<TenantResolutionMiddleware> _logger;

        public TenantResolutionMiddleware(RequestDelegate next, ILogger<TenantResolutionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var tenantContext = context.RequestServices.GetRequiredService<ITenantContext>();
            
            try
            {
                await ResolveTenantAsync(context, tenantContext);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resolving tenant context");
                // Continue with null tenant context - let authorization handle it
            }

            await _next(context);
        }

        private async Task ResolveTenantAsync(HttpContext context, ITenantContext tenantContext)
        {
            // Try to resolve tenant from subdomain first
            var subdomain = ExtractSubdomain(context.Request.Host.Host);
            if (!string.IsNullOrEmpty(subdomain) && subdomain != "www")
            {
                var tenant = await GetTenantBySubdomainAsync(context, subdomain);
                if (tenant != null)
                {
                    tenantContext.SetTenant(tenant.Id, subdomain: subdomain);
                    _logger.LogDebug("Resolved tenant {TenantId} from subdomain {Subdomain}", tenant.Id, subdomain);
                    return;
                }
            }

            // Try to resolve tenant from JWT claims if user is authenticated
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var tenantIdClaim = context.User.Claims
                    .FirstOrDefault(c => c.Type == "tenant_id")?.Value;

                var branchIdClaim = context.User.Claims
                    .FirstOrDefault(c => c.Type == "branch_id")?.Value;

                if (Guid.TryParse(tenantIdClaim, out var tenantId))
                {
                    Guid? branchId = null;
                    if (Guid.TryParse(branchIdClaim, out var parsedBranchId))
                    {
                        branchId = parsedBranchId;
                    }

                    tenantContext.SetTenant(tenantId, branchId);
                    _logger.LogDebug("Resolved tenant {TenantId} from JWT claims", tenantId);
                    return;
                }
            }

            _logger.LogDebug("Could not resolve tenant context");
        }

        private string ExtractSubdomain(string host)
        {
            if (string.IsNullOrEmpty(host) || host == "localhost")
                return null;

            var parts = host.Split('.');
            if (parts.Length < 3)
                return null;

            return parts[0];
        }

        private async Task<Tenant> GetTenantBySubdomainAsync(HttpContext context, string subdomain)
        {
            try
            {
                // This would typically use a repository to look up tenant by subdomain
                // For now, we'll use a simple in-memory check or database query
                // This should be replaced with proper repository pattern
                
                var tenantRepository = context.RequestServices.GetService<ITenantRepository>();
                if (tenantRepository != null)
                {
                    // Implement GetTenantBySubdomain in ITenantRepository
                    // return await tenantRepository.GetTenantBySubdomainAsync(subdomain);
                }

                // Fallback: return default tenant for demo purposes
                if (subdomain == "default" || subdomain == "demo")
                {
                    return new Tenant("Default Tenant", "default", "Premium", DateTime.UtcNow.AddYears(1), true, Guid.Parse("00000000-0000-0000-0000-000000000001"));
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tenant by subdomain {Subdomain}", subdomain);
                return null;
            }
        }
    }

    public interface ITenantRepository
    {
        Task<Tenant> GetTenantBySubdomainAsync(string subdomain);
        Task<Tenant> GetTenantByIdAsync(Guid tenantId);
    }
}