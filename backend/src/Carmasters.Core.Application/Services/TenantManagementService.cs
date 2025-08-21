using System;
using System.Threading.Tasks;
using Carmasters.Core.Application.Authorization;
using Carmasters.Core.Domain;
using Microsoft.Extensions.Logging;
using NHibernate;

namespace Carmasters.Core.Application.Services
{
    public class TenantManagementService : ITenantManagementService
    {
        private readonly ISession _session;
        private readonly ITenancyRepository _tenancyRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ILogger<TenantManagementService> _logger;

        public TenantManagementService(
            ISession session,
            ITenancyRepository tenancyRepository,
            IPasswordHasher passwordHasher,
            ILogger<TenantManagementService> logger)
        {
            _session = session;
            _tenancyRepository = tenancyRepository;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }

        public async Task<TenantCreationResult> CreateTenantWithAdminAsync(CreateTenantRequest request)
        {
            var result = new TenantCreationResult();

            try
            {
                using var transaction = _session.BeginTransaction();

                // 1. Create the tenant
                var tenant = new Tenant(
                    request.TenantName,
                    request.Subdomain,
                    request.SubscriptionPlan,
                    request.SubscriptionExpiresAt,
                    true
                );

                _session.Save(tenant);
                await _session.FlushAsync();

                // 2. Create default branch
                var defaultBranch = new Branch(
                    request.DefaultBranchName,
                    request.DefaultBranchAddress,
                    request.DefaultBranchPhone,
                    request.DefaultBranchEmail ?? request.AdminEmail,
                    tenant,
                    true
                );

                _session.Save(defaultBranch);
                await _session.FlushAsync();

                // 3. Provision tenant database
                var databaseProvisioned = await ProvisionTenantDatabaseAsync(tenant.Id);
                if (!databaseProvisioned)
                {
                    throw new Exception("Failed to provision tenant database");
                }

                // 4. Create admin user
                var adminUser = await CreateTenantAdminUserAsync(
                    tenant.Id,
                    request.AdminUsername,
                    request.AdminEmail,
                    request.AdminPassword
                );

                // 5. Create employee record for the admin user
                var adminEmployee = new Employee(
                    request.AdminFirstName,
                    request.AdminLastName,
                    DateTime.UtcNow,
                    tenant.Id,
                    defaultBranch.Id,
                    email: request.AdminEmail,
                    proffession: "Administrator"
                );

                _session.Save(adminEmployee);
                await _session.FlushAsync();

                // 6. Generate login token
                var loginToken = await GenerateTenantLoginTokenAsync(tenant.Id, adminUser.Id.EmployeeId.Value);

                await transaction.CommitAsync();

                result.Success = true;
                result.Tenant = tenant;
                result.DefaultBranch = defaultBranch;
                result.AdminUser = adminUser;
                result.LoginToken = loginToken;
                result.LoginUrl = $"https://{tenant.Subdomain}.{GetBaseDomain()}";

                _logger.LogInformation("Successfully created tenant {TenantName} with ID {TenantId}", 
                    tenant.Name, tenant.Id);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating tenant {TenantName}", request.TenantName);
                result.Success = false;
                result.ErrorMessage = ex.Message;
                return result;
            }
        }

        public async Task<User> CreateTenantAdminUserAsync(Guid tenantId, string username, string email, string password)
        {
            try
            {
                var hashedPassword = _passwordHasher.HashPassword(password);
                
                // Create user with tenant context
                var user = new User(
                    username,
                    hashedPassword,
                    email,
                    true, // validated
                    null, // profile image
                    $"tenant_{tenantId}", // tenant name
                    tenantId,
                    null // will be set after employee is created
                );

                // Create tenant user in the main database
                await _tenancyRepository.CreateTenantUser($"tenant_{tenantId}", username, hashedPassword, Guid.Empty);
                
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating admin user for tenant {TenantId}", tenantId);
                throw;
            }
        }

        public async Task<bool> ProvisionTenantDatabaseAsync(Guid tenantId)
        {
            try
            {
                // Create tenant database
                await _tenancyRepository.CreateTenantDatabase($"tenant_{tenantId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error provisioning database for tenant {TenantId}", tenantId);
                return false;
            }
        }

        public async Task<string> GenerateTenantLoginTokenAsync(Guid tenantId, Guid userId)
        {
            // This would typically generate a JWT token with tenant context
            // For now, return a simple token format
            var token = $"{tenantId}:{userId}:{DateTime.UtcNow.Ticks}";
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(token));
        }

        private string GetBaseDomain()
        {
            // This should be configurable
            return "localhost:3000"; // For development
        }
    }
}