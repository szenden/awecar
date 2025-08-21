using System;
using System.ComponentModel.DataAnnotations;

namespace Carmasters.Http.Api.Model
{
    public class CreateTenantWithAdminDto
    {
        [Required]
        [StringLength(100)]
        public string TenantName { get; set; }
        
        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[a-z0-9-]+$", ErrorMessage = "Subdomain can only contain lowercase letters, numbers, and hyphens")]
        public string Subdomain { get; set; }
        
        [StringLength(50)]
        public string SubscriptionPlan { get; set; } = "Basic";
        
        public DateTime SubscriptionExpiresAt { get; set; } = DateTime.UtcNow.AddYears(1);
        
        // Admin user details
        [Required]
        [StringLength(50)]
        public string AdminUsername { get; set; }
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string AdminEmail { get; set; }
        
        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string AdminPassword { get; set; }
        
        [Required]
        [StringLength(50)]
        public string AdminFirstName { get; set; }
        
        [StringLength(50)]
        public string AdminLastName { get; set; }
        
        // Default branch details
        [StringLength(100)]
        public string DefaultBranchName { get; set; } = "Main Branch";
        
        [StringLength(200)]
        public string DefaultBranchAddress { get; set; }
        
        [StringLength(20)]
        public string DefaultBranchPhone { get; set; }
        
        [EmailAddress]
        [StringLength(100)]
        public string DefaultBranchEmail { get; set; }
    }

    public class TenantCreationResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public TenantDto Tenant { get; set; }
        public BranchDto DefaultBranch { get; set; }
        public string LoginToken { get; set; }
        public string LoginUrl { get; set; }
    }

    public class TenantImpersonationDto
    {
        public Guid TenantId { get; set; }
        public string TenantName { get; set; }
        public string Subdomain { get; set; }
        public string ImpersonationToken { get; set; }
        public string LoginUrl { get; set; }
        public DateTime ExpiresAt { get; set; }
    }

    public class AdminUserDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public bool IsSystemAdmin { get; set; }
        public Guid? TenantId { get; set; }
        public string TenantName { get; set; }
    }

    public class TenantSummaryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Subdomain { get; set; }
        public string SubscriptionPlan { get; set; }
        public DateTime SubscriptionExpiresAt { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int BranchCount { get; set; }
        public int UserCount { get; set; }
        public bool IsExpired => DateTime.UtcNow > SubscriptionExpiresAt;
    }
}