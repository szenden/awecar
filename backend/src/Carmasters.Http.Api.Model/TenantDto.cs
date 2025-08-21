using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Carmasters.Http.Api.Model
{
    public class TenantDto
    {
        public Guid Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Subdomain { get; set; }
        
        [StringLength(50)]
        public string SubscriptionPlan { get; set; }
        
        public DateTime SubscriptionExpiresAt { get; set; }
        
        public bool IsActive { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime UpdatedAt { get; set; }
        
        public List<BranchDto> Branches { get; set; } = new List<BranchDto>();
    }

    public class CreateTenantDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Subdomain { get; set; }
        
        [StringLength(50)]
        public string SubscriptionPlan { get; set; } = "Basic";
        
        public DateTime SubscriptionExpiresAt { get; set; } = DateTime.UtcNow.AddYears(1);
        
        public bool IsActive { get; set; } = true;
    }

    public class UpdateTenantDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Subdomain { get; set; }
        
        [StringLength(50)]
        public string SubscriptionPlan { get; set; }
        
        public DateTime SubscriptionExpiresAt { get; set; }
        
        public bool IsActive { get; set; }
    }
}