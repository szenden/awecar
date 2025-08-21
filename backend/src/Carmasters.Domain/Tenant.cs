using System;
using System.Collections.Generic;
using System.Linq;

namespace Carmasters.Core.Domain
{
    public class Tenant : GuidIdentityEntity
    {
        private readonly IList<Branch> _branches = new List<Branch>();

        protected Tenant() { }

        public Tenant(
            string name,
            string subdomain,
            string subscriptionPlan,
            DateTime subscriptionExpiresAt,
            bool isActive = true,
            Guid? id = null)
        {
            Id = id.GetValueOrDefault();
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Subdomain = subdomain ?? throw new ArgumentNullException(nameof(subdomain));
            SubscriptionPlan = subscriptionPlan;
            SubscriptionExpiresAt = subscriptionExpiresAt;
            IsActive = isActive;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public virtual string Name { get; protected set; }
        public virtual string Subdomain { get; protected set; }
        public virtual string SubscriptionPlan { get; protected set; }
        public virtual DateTime SubscriptionExpiresAt { get; protected set; }
        public virtual bool IsActive { get; protected set; }
        public virtual DateTime CreatedAt { get; protected set; }
        public virtual DateTime UpdatedAt { get; protected set; }

        public virtual IReadOnlyCollection<Branch> Branches => _branches.ToList().AsReadOnly();

        public virtual void Update(
            string name,
            string subdomain,
            string subscriptionPlan,
            DateTime subscriptionExpiresAt,
            bool isActive)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Subdomain = subdomain ?? throw new ArgumentNullException(nameof(subdomain));
            SubscriptionPlan = subscriptionPlan;
            SubscriptionExpiresAt = subscriptionExpiresAt;
            IsActive = isActive;
            UpdatedAt = DateTime.UtcNow;
        }

        public virtual void AddBranch(Branch branch)
        {
            if (branch == null) throw new ArgumentNullException(nameof(branch));
            if (_branches.Any(b => b.Name == branch.Name))
                throw new InvalidOperationException($"Branch with name '{branch.Name}' already exists in this tenant");
            
            _branches.Add(branch);
        }

        public virtual void RemoveBranch(Branch branch)
        {
            if (branch == null) throw new ArgumentNullException(nameof(branch));
            _branches.Remove(branch);
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

        public virtual bool IsSubscriptionExpired => DateTime.UtcNow > SubscriptionExpiresAt;
    }
}