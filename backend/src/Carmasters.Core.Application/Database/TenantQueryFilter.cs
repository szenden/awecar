using System;
using System.Linq;
using Carmasters.Core.Application.Services;
using Carmasters.Core.Domain.Repository;
using Microsoft.Extensions.DependencyInjection;
using NHibernate;
using NHibernate.Event;

namespace Carmasters.Core.Application.Database
{
    public class TenantQueryFilter : IPreLoadEventListener
    {
        private readonly IServiceProvider _serviceProvider;

        public TenantQueryFilter(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public void OnPreLoad(PreLoadEvent @event)
        {
            // This is called before entities are loaded
            // We can modify the query here if needed
        }
    }

    public static class TenantFilterExtensions
    {
        public static IQueryOver<T, T> ApplyTenantFilter<T>(this IQueryOver<T, T> query, ITenantContext tenantContext)
            where T : class, ITenantEntity
        {
            if (tenantContext.TenantId.HasValue)
            {
                query = query.Where(x => x.TenantId == tenantContext.TenantId.Value);
            }

            if (tenantContext.BranchId.HasValue)
            {
                query = query.Where(x => x.BranchId == tenantContext.BranchId.Value || x.BranchId == null);
            }

            return query;
        }

        public static IQuery ApplyTenantFilter(this IQuery query, ITenantContext tenantContext)
        {
            if (tenantContext.TenantId.HasValue)
            {
                query.SetParameter("tenantId", tenantContext.TenantId.Value);
            }

            if (tenantContext.BranchId.HasValue)
            {
                query.SetParameter("branchId", tenantContext.BranchId.Value);
            }

            return query;
        }
    }
}