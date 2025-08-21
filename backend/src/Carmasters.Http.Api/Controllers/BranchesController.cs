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
    public class BranchesController : BaseController
    {
        private readonly ISession _session;
        private readonly ITenantContext _tenantContext;
        private readonly IMapper _mapper;

        public BranchesController(ISession session, ITenantContext tenantContext, IMapper mapper)
        {
            _session = session;
            _tenantContext = tenantContext;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BranchDto>>> GetBranches()
        {
            if (!_tenantContext.TenantId.HasValue)
            {
                return Forbid("No tenant context available");
            }

            var branches = await _session
                .QueryOver<Branch>()
                .Where(b => b.TenantId == _tenantContext.TenantId.Value)
                .ListAsync();

            var branchDtos = _mapper.Map<IEnumerable<BranchDto>>(branches);
            return Ok(branchDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BranchDto>> GetBranch(Guid id)
        {
            if (!_tenantContext.TenantId.HasValue)
            {
                return Forbid("No tenant context available");
            }

            var branch = await _session.GetAsync<Branch>(id);
            if (branch == null || branch.TenantId != _tenantContext.TenantId.Value)
            {
                return NotFound();
            }

            var branchDto = _mapper.Map<BranchDto>(branch);
            return Ok(branchDto);
        }

        [HttpPost]
        public async Task<ActionResult<BranchDto>> CreateBranch(CreateBranchDto createDto)
        {
            if (!_tenantContext.TenantId.HasValue)
            {
                return Forbid("No tenant context available");
            }

            try
            {
                var tenant = await _session.GetAsync<Tenant>(_tenantContext.TenantId.Value);
                if (tenant == null)
                {
                    return BadRequest("Invalid tenant");
                }

                var branch = new Branch(
                    createDto.Name,
                    createDto.Address,
                    createDto.Phone,
                    createDto.Email,
                    tenant,
                    createDto.IsActive
                );

                _session.Save(branch);
                await _session.FlushAsync();

                var branchDto = _mapper.Map<BranchDto>(branch);
                return CreatedAtAction(nameof(GetBranch), new { id = branch.Id }, branchDto);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating branch: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BranchDto>> UpdateBranch(Guid id, UpdateBranchDto updateDto)
        {
            if (!_tenantContext.TenantId.HasValue)
            {
                return Forbid("No tenant context available");
            }

            var branch = await _session.GetAsync<Branch>(id);
            if (branch == null || branch.TenantId != _tenantContext.TenantId.Value)
            {
                return NotFound();
            }

            try
            {
                branch.Update(
                    updateDto.Name,
                    updateDto.Address,
                    updateDto.Phone,
                    updateDto.Email,
                    updateDto.IsActive
                );

                _session.Update(branch);
                await _session.FlushAsync();

                var branchDto = _mapper.Map<BranchDto>(branch);
                return Ok(branchDto);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating branch: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBranch(Guid id)
        {
            if (!_tenantContext.TenantId.HasValue)
            {
                return Forbid("No tenant context available");
            }

            var branch = await _session.GetAsync<Branch>(id);
            if (branch == null || branch.TenantId != _tenantContext.TenantId.Value)
            {
                return NotFound();
            }

            try
            {
                branch.Deactivate();
                _session.Update(branch);
                await _session.FlushAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error deactivating branch: {ex.Message}");
            }
        }
    }
}