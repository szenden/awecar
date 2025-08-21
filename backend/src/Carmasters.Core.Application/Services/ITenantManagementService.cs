using System;
using System.Threading.Tasks;
using Carmasters.Core.Domain;

namespace Carmasters.Core.Application.Services
{
    public interface ITenantManagementService
    {
        Task<TenantCreationResult> CreateTenantWithAdminAsync(CreateTenantRequest request);
        Task<string> GenerateTenantLoginTokenAsync(Guid tenantId, Guid userId);
        Task<bool> ProvisionTenantDatabaseAsync(Guid tenantId);
        Task<User> CreateTenantAdminUserAsync(Guid tenantId, string username, string email, string password);
    }

    public class CreateTenantRequest
    {
        public string TenantName { get; set; }
        public string Subdomain { get; set; }
        public string SubscriptionPlan { get; set; } = "Basic";
        public DateTime SubscriptionExpiresAt { get; set; } = DateTime.UtcNow.AddYears(1);
        
        // Initial admin user details
        public string AdminUsername { get; set; }
        public string AdminEmail { get; set; }
        public string AdminPassword { get; set; }
        public string AdminFirstName { get; set; }
        public string AdminLastName { get; set; }
        
        // Default branch details
        public string DefaultBranchName { get; set; } = "Main Branch";
        public string DefaultBranchAddress { get; set; }
        public string DefaultBranchPhone { get; set; }
        public string DefaultBranchEmail { get; set; }
    }

    public class TenantCreationResult
    {
        public bool Success { get; set; }
        public string ErrorMessage { get; set; }
        public Tenant Tenant { get; set; }
        public Branch DefaultBranch { get; set; }
        public User AdminUser { get; set; }
        public string LoginToken { get; set; }
        public string LoginUrl { get; set; }
    }
}