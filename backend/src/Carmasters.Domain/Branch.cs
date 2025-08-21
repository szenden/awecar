using System;

namespace Carmasters.Core.Domain
{
    public class Branch : GuidIdentityEntity
    {
        protected Branch() { }

        public Branch(
            string name,
            string address,
            string phone,
            string email,
            Tenant tenant,
            bool isActive = true,
            Guid? id = null)
        {
            Id = id.GetValueOrDefault();
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Address = address;
            Phone = phone;
            Email = email;
            Tenant = tenant ?? throw new ArgumentNullException(nameof(tenant));
            TenantId = tenant.Id;
            IsActive = isActive;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public virtual string Name { get; protected set; }
        public virtual string Address { get; protected set; }
        public virtual string Phone { get; protected set; }
        public virtual string Email { get; protected set; }
        public virtual bool IsActive { get; protected set; }
        public virtual DateTime CreatedAt { get; protected set; }
        public virtual DateTime UpdatedAt { get; protected set; }

        public virtual Guid TenantId { get; protected set; }
        public virtual Tenant Tenant { get; protected set; }

        public virtual void Update(
            string name,
            string address,
            string phone,
            string email,
            bool isActive)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Address = address;
            Phone = phone;
            Email = email;
            IsActive = isActive;
            UpdatedAt = DateTime.UtcNow;
        }

        public virtual void Deactivate()
        {
            IsActive = false;
            UpdatedAt = DateTime.UtcNow;
        }

        public virtual void Activate()
        {
            IsActive = true;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}