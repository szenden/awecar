using System;
using System.Threading.Tasks;
using Carmasters.Core.Application.Middleware;
using Carmasters.Core.Domain;
using Microsoft.Extensions.Logging;
using NHibernate;

namespace Carmasters.Core.Repository.Postgres
{
    public class TenantRepository : ITenantRepository
    {
        private readonly ISession _session;
        private readonly ILogger<TenantRepository> _logger;

        public TenantRepository(ISession session, ILogger<TenantRepository> logger)
        {
            _session = session;
            _logger = logger;
        }

        public async Task<Tenant> GetTenantBySubdomainAsync(string subdomain)
        {
            try
            {
                var tenant = await _session
                    .QueryOver<Tenant>()
                    .Where(t => t.Subdomain == subdomain && t.IsActive)
                    .SingleOrDefaultAsync();

                return tenant;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tenant by subdomain {Subdomain}", subdomain);
                return null;
            }
        }

        public async Task<Tenant> GetTenantByIdAsync(Guid tenantId)
        {
            try
            {
                var tenant = await _session
                    .QueryOver<Tenant>()
                    .Where(t => t.Id == tenantId && t.IsActive)
                    .SingleOrDefaultAsync();

                return tenant;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tenant by ID {TenantId}", tenantId);
                return null;
            }
        }
    }
}