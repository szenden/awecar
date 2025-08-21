using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Carmasters.Core.Application.Services;
using Carmasters.Core.Domain;
using Carmasters.Http.Api.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NHibernate;

namespace Carmasters.Http.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TenantsController : BaseController
    {
        private readonly ISession _session;
        private readonly ITenantContext _tenantContext;
        private readonly IMapper _mapper;

        public TenantsController(ISession session, ITenantContext tenantContext, IMapper mapper)
        {
            _session = session;
            _tenantContext = tenantContext;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TenantDto>>> GetTenants()
        {
            // Only system admins should be able to list all tenants
            // For now, return current tenant only
            if (_tenantContext.TenantId.HasValue)
            {
                var tenant = await _session.GetAsync<Tenant>(_tenantContext.TenantId.Value);
                if (tenant != null)
                {
                    var tenantDto = _mapper.Map<TenantDto>(tenant);
                    return Ok(new[] { tenantDto });
                }
            }

            return Ok(new List<TenantDto>());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TenantDto>> GetTenant(Guid id)
        {
            // Users can only view their own tenant
            if (_tenantContext.TenantId != id)
            {
                return Forbid();
            }

            var tenant = await _session.GetAsync<Tenant>(id);
            if (tenant == null)
            {
                return NotFound();
            }

            var tenantDto = _mapper.Map<TenantDto>(tenant);
            return Ok(tenantDto);
        }

        [HttpPost]
        public async Task<ActionResult<TenantDto>> CreateTenant(CreateTenantDto createDto)
        {
            // Only system admins should be able to create tenants
            // This is a simplified implementation
            try
            {
                var tenant = new Tenant(
                    createDto.Name,
                    createDto.Subdomain,
                    createDto.SubscriptionPlan,
                    createDto.SubscriptionExpiresAt,
                    createDto.IsActive
                );

                _session.Save(tenant);
                await _session.FlushAsync();

                var tenantDto = _mapper.Map<TenantDto>(tenant);
                return CreatedAtAction(nameof(GetTenant), new { id = tenant.Id }, tenantDto);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating tenant: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TenantDto>> UpdateTenant(Guid id, UpdateTenantDto updateDto)
        {
            // Users can only update their own tenant
            if (_tenantContext.TenantId != id)
            {
                return Forbid();
            }

            var tenant = await _session.GetAsync<Tenant>(id);
            if (tenant == null)
            {
                return NotFound();
            }

            try
            {
                tenant.Update(
                    updateDto.Name,
                    updateDto.Subdomain,
                    updateDto.SubscriptionPlan,
                    updateDto.SubscriptionExpiresAt,
                    updateDto.IsActive
                );

                _session.Update(tenant);
                await _session.FlushAsync();

                var tenantDto = _mapper.Map<TenantDto>(tenant);
                return Ok(tenantDto);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating tenant: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTenant(Guid id)
        {
            // Users can only deactivate their own tenant (soft delete)
            if (_tenantContext.TenantId != id)
            {
                return Forbid();
            }

            var tenant = await _session.GetAsync<Tenant>(id);
            if (tenant == null)
            {
                return NotFound();
            }

            try
            {
                tenant.Deactivate();
                _session.Update(tenant);
                await _session.FlushAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error deactivating tenant: {ex.Message}");
            }
        }
    }
}