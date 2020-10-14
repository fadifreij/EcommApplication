using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiApplication.Models;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiApplication.Controllers
{
    [Authorize(Roles="Admin")]
    public class AdministrationController : BaseController
    {
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly UserManager<ApplicationUser> userManager;

        public AdministrationController(RoleManager<IdentityRole> roleManager ,
                                        UserManager<ApplicationUser> userManager)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
        }
        [Route("Role/AddRole")]
        [HttpPost]
        public async Task<IActionResult>AddNewRole(string RoleName)
        {
            var isExists = await roleManager.FindByNameAsync(RoleName);
            if(isExists != null)
            {
                return BadRequest("Role Exists.");
            }

            var identityRole = new IdentityRole() { Name = RoleName };
            var result = await roleManager.CreateAsync(identityRole);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }
        [Route("Role/DeleteRole")]
        [HttpPost]
        public async Task<IActionResult> RemoveRole(string RoleName)
        {
            var role = await roleManager.FindByNameAsync(RoleName);
            if(role == null)
            {
                return BadRequest("Role Not Exists.");
            }

            var result = await roleManager.DeleteAsync(role);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }
        [Route("Role/{RoleName}/Add/{UserName}")]
        [HttpPost]
        public async Task<IActionResult> AddUserToRole(string RoleName ,string UserName)
        {
            var user = await userManager.FindByNameAsync(UserName);
            if(user == null)
            {
                return BadRequest("User name not exists");
            }
            var role = await roleManager.FindByNameAsync(RoleName);
            if(role == null)
            {
                return BadRequest("Role not exists");
            }

            var addUserToRole = await userManager.AddToRoleAsync(user, RoleName);
            if (addUserToRole.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest(addUserToRole.Errors);
            }
        }
        [Route("Role/{RoleName}/Remove/{UserName}")]
        [HttpPost]
        public async Task<IActionResult> RemoveUserFromRole(string RoleName, string UserName)
        {
            var user = await userManager.FindByNameAsync(UserName);
            if (user == null)
            {
                return BadRequest("User name not exists");
            }
            var role = await roleManager.FindByNameAsync(RoleName);
            if (role == null)
            {
                return BadRequest("Role not exists");
            }

            var removeUserFromRole = await userManager.RemoveFromRoleAsync(user, RoleName);

            if (removeUserFromRole.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest(removeUserFromRole.Errors);
            }
        }
        [Route("ListUsers")]
        [HttpGet] 
        public async Task<IActionResult> ListUsers(string email ="" , string username = "")
        {
           
            if(email != "" || username != "")
            {
                var userList1 = await (from user in userManager.Users
                                      select new
                                      {
                                          UserId = user.Id,
                                          UserName = user.UserName,
                                          user.Email,
                                          user.EmailConfirmed,
                                          user.LockoutEnd,
                                          roleNamesForUser = (userManager.GetRolesAsync(user).GetAwaiter().GetResult().ToArray())
                                      }).Where(p=> ( email== "" || p.Email.IndexOf(email) != -1 ) && ( username == "" || p.UserName.IndexOf(username) !=-1))
                                      .ToListAsync();
                return Ok(userList1);
            }
            
            var userList =await (from user in userManager.Users
                                 select new
                                 {
                                     UserId = user.Id,
                                     UserName = user.UserName,
                                     user.Email,
                                     user.EmailConfirmed,
                                     user.LockoutEnd,
                                     roleNamesForUser = ( userManager.GetRolesAsync(user).GetAwaiter().GetResult().ToArray()) 
                                                             
                                 }).ToListAsync();

          
            return Ok(userList);
        }
       
        [Route("GetUser/{userId}")]
        [HttpGet]
        public async Task<IActionResult> GetUsers(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);

           
           
            var roles = new List<UserRolesViewModel>();
                foreach (var r in roleManager.Roles.ToList())
                {
                   

                    var rElem = new UserRolesViewModel
                    {
                        RoleId = r.Id,
                        RoleName = r.Name,
                        IsSelected = userManager.IsInRoleAsync(user, r.Name).GetAwaiter().GetResult()
                    };
                   if(!rElem.IsSelected)
                       roles.Add(rElem);
                }
                var uList = new UsersListViewModel
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    LockoutEnd = user.LockoutEnd.ToString(),
                    RoleNamesForUser = userManager.GetRolesAsync(user).GetAwaiter().GetResult().ToList(),
                    Roles = roles


                };

              
            




            return Ok(uList);
        }

        [Route("EditUserRoles")]
        [HttpPost]
        public async Task<IActionResult> EditUserRoles(EditUserRoleViewModel model)
        {
            try
            {
                var user = await userManager.FindByIdAsync(model.UserId);

                //remove the roles for that users in list roles
                foreach(var role in model.Roles)
                {
                    if (await userManager.IsInRoleAsync(user, role))
                        await userManager.RemoveFromRoleAsync(user, role);
                }
                


                // add roles to that user in list userRoles
                foreach (var role in model.RoleNamesForUser)
                {
                  if(!await userManager.IsInRoleAsync(user,role))
                    await userManager.AddToRoleAsync(user, role);
                }

                //update lock state 
                DateTime? lockoutEndDate = null;
                lockoutEndDate = (model.IsActive == true) ? lockoutEndDate : new DateTime(2999, 01, 01);

              //  var lockoutEndDate = new DateTime(2999, 01, 01);
              //  await userManager.SetLockoutEnabledAsync(user, !model.IsActive);
                await userManager.SetLockoutEndDateAsync(user, lockoutEndDate);

                return Ok();
            }
            catch (Exception ex)
            {

                throw ex;
            }
           
        }
    }
}