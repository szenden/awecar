using System;

namespace Carmasters.Core.Application.Services
{
    public interface ITenantContext
    {
        Guid? TenantId { get; }
        Guid? BranchId { get; }
        string TenantSubdomain { get; }
        void SetTenant(Guid tenantId, Guid? branchId = null, string subdomain = null);
        void Clear();
    }
}