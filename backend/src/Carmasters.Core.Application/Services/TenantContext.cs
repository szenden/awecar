using System;

namespace Carmasters.Core.Application.Services
{
    public class TenantContext : ITenantContext
    {
        public Guid? TenantId { get; private set; }
        public Guid? BranchId { get; private set; }
        public string TenantSubdomain { get; private set; }

        public void SetTenant(Guid tenantId, Guid? branchId = null, string subdomain = null)
        {
            TenantId = tenantId;
            BranchId = branchId;
            TenantSubdomain = subdomain;
        }

        public void Clear()
        {
            TenantId = null;
            BranchId = null;
            TenantSubdomain = null;
        }
    }
}