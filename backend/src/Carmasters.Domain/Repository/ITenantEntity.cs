using System;

namespace Carmasters.Core.Domain.Repository
{
    public interface ITenantEntity
    {
        Guid TenantId { get; }
        Guid? BranchId { get; }
    }
}