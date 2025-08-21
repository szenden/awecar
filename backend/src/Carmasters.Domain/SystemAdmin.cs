using System;

namespace Carmasters.Core.Domain
{
    public class SystemAdmin : GuidIdentityEntity
    {
        protected SystemAdmin() { }

        public SystemAdmin(
            string username,
            string email,
            string firstName,
            string lastName,
            bool isActive = true,
            Guid? id = null)
        {
            Id = id.GetValueOrDefault();
            Username = username ?? throw new ArgumentNullException(nameof(username));
            Email = email ?? throw new ArgumentNullException(nameof(email));
            FirstName = firstName ?? throw new ArgumentNullException(nameof(firstName));
            LastName = lastName;
            IsActive = isActive;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public virtual string Username { get; protected set; }
        public virtual string Email { get; protected set; }
        public virtual string FirstName { get; protected set; }
        public virtual string LastName { get; protected set; }
        public virtual bool IsActive { get; protected set; }
        public virtual DateTime CreatedAt { get; protected set; }
        public virtual DateTime UpdatedAt { get; protected set; }

        public virtual string FullName => $"{FirstName} {LastName}".Trim();

        public virtual void Update(
            string email,
            string firstName,
            string lastName,
            bool isActive)
        {
            Email = email ?? throw new ArgumentNullException(nameof(email));
            FirstName = firstName ?? throw new ArgumentNullException(nameof(firstName));
            LastName = lastName;
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