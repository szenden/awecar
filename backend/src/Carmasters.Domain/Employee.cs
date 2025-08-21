using System;
using System.Runtime.CompilerServices;
using Carmasters.Core.Domain.Repository;

namespace Carmasters.Core.Domain
{
    public class Employee: TenantEntity
    {
        public Employee() { }
        public  Employee(string firstName, string lastName, DateTime introducedAt, Guid tenantId, Guid? branchId = null, string phone = null, string email= null, string proffession = null, string description = null, Guid? id = null) : base(tenantId, branchId)
        {
            Id = id.GetValueOrDefault();
            IntroducedAt = introducedAt;
            this.Change(firstName, lastName, phone, email, proffession, description);
        }

        public  virtual string FirstName { get; protected set; }
        public  virtual string LastName { get; protected set; }
         
        
        public  virtual string Name { get { return $"{FirstName} {LastName}"; } }

        public  virtual void Change(string firstname, string lastname, string phone, string email, string proffession, string description)
        {
            ChangeName(firstname, lastname);
            Phone = phone;
            Email = email;
            Proffession = proffession;
            Description = description;
        }

        public virtual void ChangeName(string firstName, string lastName)
        {
            if (string.IsNullOrWhiteSpace(firstName))
            {
                throw new UserException("First name cannot be empty");
            }

            FirstName = firstName;
            LastName = lastName;
        }

        public  virtual string Phone { get; protected set; }
        public  virtual string Email { get; protected set; }
        public  virtual string Proffession { get; protected set; }
        public  virtual string Description { get; protected set; }
        public  virtual DateTime IntroducedAt { get; }
        
    }
}