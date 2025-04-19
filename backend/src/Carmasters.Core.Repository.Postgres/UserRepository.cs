using Carmasters.Core.Application;
using Carmasters.Core.Application.Configuration;
using Carmasters.Core.Application.Database;
using Carmasters.Core.Application.Model;
using Carmasters.Core.Domain;
using Carmasters.Http.Api.Models;
using Dapper;
using Microsoft.Extensions.Options;
using NHibernate;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Net.Mail;

namespace Carmasters.Core.Repository.Postgres
{
    /// <summary>
    /// TODO, transaction handling and separate connection handling .. kinda special case but without multitenancy it should work as normal .. needs to implemented better
    /// </summary>
    public class UserRepository :  IUserRepository
    {
        private readonly DbOptions dbOptions;

        public UserRepository(IOptions<DbOptions> dbOptions) 
        {
            this.dbOptions = dbOptions.Value;
        }

        public User GetBy(string userName)
        {
           
            using (var connection = CreateConnection())
            {
                var user = connection.QuerySingleOrDefault<UserDto>(
                    "SELECT profile_image as ProfileImage,UserName, Password, TenantName, Email, Validated, EmployeeId FROM public.user WHERE UserName = @UserName",
                    new { UserName = userName });

                if (user == null)
                    return null;

                return new User(user.UserName, user.Password, user.Email, user.Validated, user.ProfileImage,
                    new UserIdentifier(user.TenantName, user.EmployeeId));
            }
        }

        private DbConnection CreateConnection()
        {
            string databaseName = dbOptions.MultiTenancy.Enabled? new MultiTenancyDbName(dbOptions, DbKind.Tenancy) : dbOptions.Name;
            var connectionBuilder = new Npgsql.NpgsqlConnectionStringBuilder
            {
                Host = dbOptions.Host,
                Port = dbOptions.Port,
                Username = dbOptions.UserId,
                Password = dbOptions.Password,
                Database = databaseName
            };

            var connection = new Npgsql.NpgsqlConnection(connectionBuilder.ToString());
            connection.Open();
            return connection;
        }

        public User GetByEmail(string email)
        {
            using (var connection = CreateConnection())
            {
                var user = connection.QuerySingleOrDefault<UserDto>(
                    "SELECT profile_image as ProfileImage,UserName, Password, TenantName, Email, Validated, EmployeeId FROM public.user WHERE Email = @Email",
                    new { Email = email });

                if (user == null)
                    return null;

                return new User(user.UserName, user.Password, user.Email, user.Validated, user.ProfileImage,
                    new UserIdentifier(user.TenantName, user.EmployeeId));
            }
        }
        public User GetBy(UserIdentifier id)
        { 
            using (var connection = CreateConnection())
            {
                var user = connection.QuerySingleOrDefault<UserDto>(
                    "SELECT profile_image as ProfileImage,UserName, Password, TenantName, Email, Validated, EmployeeId FROM public.user WHERE EmployeeId = @EmployeeId AND TenantName = @TenantName",
                    new { EmployeeId = id.EmployeeId, TenantName = id.TenantName });

                if (user == null)
                    return null;

                return new User(user.UserName, user.Password, user.Email, user.Validated, user.ProfileImage,
                    new UserIdentifier(user.TenantName, user.EmployeeId));
            }
        }


        public void Update(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            if (user.Id == null)
                throw new ArgumentException("Cannot update user without a valid identifier");
             
            using (var connection = CreateConnection())
            {
                // Begin a transaction to ensure data consistency
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // Update the user record
                        int rowsAffected = connection.Execute(
                            @"UPDATE public.user 
                              SET UserName = @UserName, 
                                  Password = @Password, 
                                  Email = @Email, 
                                  Validated = @Validated, 
                                  Profile_Image = @ProfileImage
                              WHERE TenantName = @TenantName AND EmployeeId = @EmployeeId",
                            new
                            {
                                UserName = user.UserName,
                                Password = user.Password,
                                Email = user.Email,
                                Validated = user.Validated,
                                ProfileImage = user.ProfileImage,
                                TenantName = user.Id.TenantName,
                                EmployeeId = user.Id.EmployeeId
                            });

                        if (rowsAffected == 0)
                        {
                            throw new EntityNotFoundException($"User with ID {user.Id.TenantName}/{user.Id.EmployeeId} not found");
                        }

                        transaction.Commit();
                    }
                    catch (Exception)
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        public IEnumerable<User> GetAllByTenant(string tenantName)
        { 
            using (var connection = CreateConnection())
            {
                var users = connection.Query<UserDto>(
                    "SELECT profile_image as ProfileImage,UserName, Password, TenantName, Email, Validated, EmployeeId FROM public.user WHERE TenantName = @TenantName",
                    new { TenantName = tenantName });

                foreach (var user in users)
                {
                   yield return new User(user.UserName, user.Password, user.Email, user.Validated,user.ProfileImage,
                                      new UserIdentifier(user.TenantName, user.EmployeeId));
                } 
            } 
        }
    }
}