using System;
using System.ComponentModel.DataAnnotations;

namespace Carmasters.Http.Api.Model
{
    public class BranchDto
    {
        public Guid Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [StringLength(200)]
        public string Address { get; set; }
        
        [StringLength(20)]
        public string Phone { get; set; }
        
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }
        
        public Guid TenantId { get; set; }
        
        public bool IsActive { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateBranchDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [StringLength(200)]
        public string Address { get; set; }
        
        [StringLength(20)]
        public string Phone { get; set; }
        
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }
        
        public bool IsActive { get; set; } = true;
    }

    public class UpdateBranchDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [StringLength(200)]
        public string Address { get; set; }
        
        [StringLength(20)]
        public string Phone { get; set; }
        
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }
        
        public bool IsActive { get; set; }
    }
}