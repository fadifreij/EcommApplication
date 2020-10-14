using ApiApplication.Core;
using ApiApplication.Models;
using DAL.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Presistence
{
    public class AuthRepository : IAuthRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthRepository(UserManager<ApplicationUser> userManager,SignInManager<ApplicationUser> signInManager)
        {
           _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<IEnumerable<string>> GetRolesAsync(ApplicationUser user)
        {
            return await _userManager.GetRolesAsync(user);
        }

        public async Task<IdentityResult> AddToRoleAsync(ApplicationUser user, string role)
        {
            return await _userManager.AddToRoleAsync(user, role);
        }


        public async Task<IdentityResult> RemoveFromRoleAsync(ApplicationUser user, string role)
        {
            return await _userManager.RemoveFromRoleAsync(user, role);
        }
       
        public async Task<bool> CheckPasswordAsync(ApplicationUser user, string password)
        {
            return await _userManager.CheckPasswordAsync(user, password);
        }
       
        public async Task<SignInResult> SignInAsync(ApplicationUser user, string password)
        {
            return await _signInManager.CheckPasswordSignInAsync(user, password,false);
        }

        public async Task<IdentityResult> CreateUserAsync(ApplicationUser user, string password)
        {
          return await  _userManager.CreateAsync(user, password);
        }

        public async Task<ApplicationUser> FindByIdAsync(string id)
        {
            return await _userManager.FindByIdAsync(id);
        }

        public async Task<ApplicationUser> FindByUserNameAsync(string userName)
        {
            return await _userManager.FindByNameAsync(userName);
        }

       public async Task<ApplicationUser> FindByEmailAsync(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<IdentityResult> ResetPassword(ResetPasswordViewModel model)
        {
            IdentityError err = new IdentityError();
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                err.Code = "404";
                err.Description = "Email not found!";
                return await Task.FromResult<IdentityResult>(IdentityResult.Failed(err));
             
            }

            var checkPassword = await _userManager.CheckPasswordAsync(user, model.OldPassword);
            if(!checkPassword)
            {
                err.Code = "401";
                err.Description = "Old password invalid!";
                return await  Task.FromResult(IdentityResult.Failed(err));
            }

            string resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            IdentityResult passwordChangeResult = await _userManager.ResetPasswordAsync(user, resetToken, model.NewPassword);

            return passwordChangeResult;
        }

        public async Task<IdentityResult> UpdateFirstLastName(string UserName , string FirstName ,string LastName)
        {
            var userIdentity = await _userManager.FindByNameAsync(UserName);
            userIdentity.FirstName = FirstName;
            userIdentity.LastName = LastName;
            var result = await _userManager.UpdateAsync(userIdentity);
            return result;
        }

        public async Task<ApplicationUser> GetFirstLastName(ApplicationUser user) => await _userManager.FindByNameAsync(user.UserName);
       
    } 
}
