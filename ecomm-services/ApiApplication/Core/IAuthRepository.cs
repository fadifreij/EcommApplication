using ApiApplication.Models;
using DAL.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Core
{
   public interface IAuthRepository
    {
        Task<IEnumerable<string>> GetRolesAsync(ApplicationUser user);
        Task<IdentityResult> AddToRoleAsync(ApplicationUser user, string role);
        Task<IdentityResult> RemoveFromRoleAsync(ApplicationUser user, string role);
        Task<bool> CheckPasswordAsync(ApplicationUser user, string password);
        Task<SignInResult> SignInAsync(ApplicationUser user, string password);
        Task<IdentityResult> CreateUserAsync(ApplicationUser user, string password);
        Task<ApplicationUser> FindByIdAsync(string id);
        Task<ApplicationUser> FindByUserNameAsync(string userName);

        Task<ApplicationUser> FindByEmailAsync(string email);

        Task<IdentityResult> ResetPassword(ResetPasswordViewModel model);
        Task<IdentityResult> UpdateFirstLastName(string UserName,string FirstName , string LastName);
        Task<ApplicationUser> GetFirstLastName(ApplicationUser user);

    }
}
