using Carmasters.Core.Domain;
using Carmasters.Core.Domain.Repository;
using Carmasters.Core.Application.Services;
using Carmasters.Core.Application.Database;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Data;
using NHibernate;
using NHibernate.Criterion;
using System;

namespace Carmasters.Core.Repository.Postgres
{
    public class GenericRepository : IRepository
    {
        protected readonly ISession context;
        protected readonly ITenantContext _tenantContext;

        [DebuggerStepThrough]
        public GenericRepository(ISession context, ITenantContext tenantContext) {
            this.context = context;
            this._tenantContext = tenantContext;
        }
         
        public T Get<T>(Guid id,bool failWhenNotFound = true) where T : class
        {
            var entity= context.Get<T>(id);
            
            // Apply tenant filter if entity implements ITenantEntity
            if (entity is ITenantEntity tenantEntity && _tenantContext.TenantId.HasValue)
            {
                if (tenantEntity.TenantId != _tenantContext.TenantId.Value)
                {
                    entity = null; // Hide entity from different tenant
                }
            }
            
            if (entity == null && failWhenNotFound) {
                throw new EntityNotFoundException(typeof(T).Name);
            } 
            return entity;
        }
           
        public virtual void Add<T>(T entity)  where T: class
        {
            // Set tenant context for new entities
            if (entity is ITenantEntity tenantEntity && _tenantContext.TenantId.HasValue)
            {
                if (tenantEntity.TenantId == Guid.Empty)
                {
                    // Use reflection to set tenant info for new entities
                    var tenantEntityType = entity.GetType();
                    var tenantIdProperty = tenantEntityType.GetProperty("TenantId");
                    var branchIdProperty = tenantEntityType.GetProperty("BranchId");
                    
                    tenantIdProperty?.SetValue(entity, _tenantContext.TenantId.Value);
                    branchIdProperty?.SetValue(entity, _tenantContext.BranchId);
                }
            }
            
            context.Save(entity); 
        } 
        public virtual void Update<T>(T entity) where T : class
        {
            context.Update(entity);
        } 
        public virtual void Delete<T>(T entity) where T : class
        {
            context.Delete(entity);
        }

        public IDbConnection GetConnection()
        {
            return context.Connection;
        }
    }
}