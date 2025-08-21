using System;

namespace Carmasters.Core.Domain.Repository
{
    public abstract class TenantEntity : GuidIdentityEntity, ITenantEntity
    {
        protected TenantEntity() { }

        protected TenantEntity(Guid tenantId, Guid? branchId = null)
        {
            TenantId = tenantId;
            BranchId = branchId;
        }

        public virtual Guid TenantId { get; protected set; }
        public virtual Guid? BranchId { get; protected set; }

        protected virtual void SetTenant(Guid tenantId, Guid? branchId = null)
        {
            TenantId = tenantId;
            BranchId = branchId;
        }
    }
}