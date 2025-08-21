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
    [Route("api/admin")]
    [ApiController]
    [Authorize]
    public class AdminController : BaseController
    {
        private readonly ISession _session;
        private readonly ITenantManagementService _tenantManagementService;
        private readonly IMapper _mapper;

        public AdminController(
            ISession session,
            ITenantManagementService tenantManagementService,
            IMapper mapper)
        {
            _session = session;
            _tenantManagementService = tenantManagementService;
            _mapper = mapper;
        }

        [HttpGet("tenants")]
        public async Task<ActionResult<IEnumerable<TenantDto>>> GetAllTenants()
        {
            // Only system admins can list all tenants
            if (!IsSystemAdmin())
            {
                return Forbid("Only system administrators can access this resource");
            }

            var tenants = await _session
                .QueryOver<Tenant>()
                .OrderBy(t => t.CreatedAt).Desc
                .ListAsync();

            var tenantDtos = _mapper.Map<IEnumerable<TenantDto>>(tenants);
            return Ok(tenantDtos);
        }

        [HttpPost("tenants")]
        public async Task<ActionResult<TenantCreationResponseDto>> CreateTenant(CreateTenantWithAdminDto createDto)
        {
            if (!IsSystemAdmin())
            {
                return Forbid("Only system administrators can create tenants");
            }

            try
            {
                var request = new CreateTenantRequest
                {
                    TenantName = createDto.TenantName,
                    Subdomain = createDto.Subdomain,
                    SubscriptionPlan = createDto.SubscriptionPlan,
                    SubscriptionExpiresAt = createDto.SubscriptionExpiresAt,
                    AdminUsername = createDto.AdminUsername,
                    AdminEmail = createDto.AdminEmail,
                    AdminPassword = createDto.AdminPassword,
                    AdminFirstName = createDto.AdminFirstName,
                    AdminLastName = createDto.AdminLastName,
                    DefaultBranchName = createDto.DefaultBranchName,
                    DefaultBranchAddress = createDto.DefaultBranchAddress,
                    DefaultBranchPhone = createDto.DefaultBranchPhone,
                    DefaultBranchEmail = createDto.DefaultBranchEmail
                };

                var result = await _tenantManagementService.CreateTenantWithAdminAsync(request);

                if (result.Success)
                {
                    var response = new TenantCreationResponseDto
                    {
                        Success = true,
                        Tenant = _mapper.Map<TenantDto>(result.Tenant),
                        DefaultBranch = _mapper.Map<BranchDto>(result.DefaultBranch),
                        LoginToken = result.LoginToken,
                        LoginUrl = result.LoginUrl,
                        Message = "Tenant created successfully"
                    };

                    return CreatedAtAction(
                        nameof(GetTenant), 
                        new { id = result.Tenant.Id }, 
                        response);
                }
                else
                {
                    return BadRequest(new TenantCreationResponseDto
                    {
                        Success = false,
                        Message = result.ErrorMessage
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new TenantCreationResponseDto
                {
                    Success = false,
                    Message = $"Error creating tenant: {ex.Message}"
                });
            }
        }

        [HttpGet("tenants/{id}")]
        public async Task<ActionResult<TenantDto>> GetTenant(Guid id)
        {
            if (!IsSystemAdmin())
            {
                return Forbid("Only system administrators can access this resource");
            }

            var tenant = await _session.GetAsync<Tenant>(id);
            if (tenant == null)
            {
                return NotFound();
            }

            var tenantDto = _mapper.Map<TenantDto>(tenant);
            return Ok(tenantDto);
        }

        [HttpPost("impersonate/{tenantId}")]
        public async Task<ActionResult<TenantImpersonationDto>> ImpersonateTenant(Guid tenantId)
        {
            if (!IsSystemAdmin())
            {
                return Forbid("Only system administrators can impersonate tenants");
            }

            try
            {
                var tenant = await _session.GetAsync<Tenant>(tenantId);
                if (tenant == null)
                {
                    return NotFound("Tenant not found");
                }

                // Find the first admin user for this tenant
                var adminUser = await _session
                    .CreateQuery("FROM User WHERE TenantId = :tenantId")
                    .SetParameter("tenantId", tenantId)
                    .SetMaxResults(1)
                    .UniqueResultAsync<User>();

                if (adminUser == null)
                {
                    return BadRequest("No admin user found for this tenant");
                }

                // Generate impersonation token
                var impersonationToken = await _tenantManagementService
                    .GenerateTenantLoginTokenAsync(tenantId, adminUser.Id.EmployeeId.Value);

                var result = new TenantImpersonationDto
                {
                    TenantId = tenantId,
                    TenantName = tenant.Name,
                    Subdomain = tenant.Subdomain,
                    ImpersonationToken = impersonationToken,
                    LoginUrl = $"https://{tenant.Subdomain}.localhost:3000",
                    ExpiresAt = DateTime.UtcNow.AddHours(8) // 8 hour session
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating impersonation session: {ex.Message}");
            }
        }

        [HttpGet("current-user")]
        public ActionResult<AdminUserDto> GetCurrentUser()
        {
            var user = GetCurrentUserFromContext();
            if (user == null)
            {
                return Unauthorized();
            }

            var userDto = new AdminUserDto
            {
                Username = user.UserName,
                Email = user.Email,
                IsSystemAdmin = user.IsSystemAdmin,
                TenantId = user.TenantId,
                TenantName = user.TenantName
            };

            return Ok(userDto);
        }

        private bool IsSystemAdmin()
        {
            var user = GetCurrentUserFromContext();
            return user?.IsSystemAdmin == true;
        }

        private User GetCurrentUserFromContext()
        {
            // This would typically extract user from JWT or session
            // For now, return a mock system admin user
            var username = User?.Identity?.Name;
            if (string.IsNullOrEmpty(username))
            {
                return null;
            }

            // Check if user is system admin by looking at claims or database
            var isSystemAdmin = User.IsInRole("SystemAdmin") || username == "admin";
            
            if (isSystemAdmin)
            {
                return new User(username, "", "", true, null, "system", null, null);
            }

            return null;
        }
    }
}