using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ApiApplication.Core;
using ApiApplication.Models;
using BusinessLayer.Genric;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ApiApplication.Controllers
{
    public class AccountController : BaseController
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _config;
        private readonly IRefreshTokenRepository _tokenRepo;
        private readonly IUnitOfWork<RefreshToken> _uow;

        public AccountController(IAuthRepository authRepository
                                , IConfiguration config
                                ,IRefreshTokenRepository tokenRepo
                                ,IUnitOfWork<RefreshToken> uow)
        {
            _authRepository = authRepository;
            _config = config;
            _tokenRepo = tokenRepo;
            _uow = uow;

        }
       
        [HttpPost("Register")]
        public async Task<IActionResult> Register(UserRegistrationModel model)
        {
           if(!ModelState.IsValid)
              return BadRequest(ModelState);
            
            
            
            var user = await _authRepository.FindByUserNameAsync(model.UserName);
            if (user != null)
              return BadRequest("name is already used.");


            var email = await _authRepository.FindByEmailAsync(model.Email);
            if (email != null)
                return BadRequest("Email is already used");

            var userToCreate = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.UserName

            };
            var result = _authRepository.CreateUserAsync(userToCreate, model.Password);
            
            if(!result.Result.Succeeded)
                return BadRequest(new ErrorViewModel() { ErrorDescription = "Registration Failed.", Errors = result.Result.Errors });

            user = await _authRepository.FindByUserNameAsync(model.UserName);
            var accessToken = await CreateAccessTokenAsync(user);
            var refreshToken = await CreateRefreshTokenAsync(user.Id);


            return Ok(new
            {
                accessToken = new JwtSecurityTokenHandler().WriteToken(accessToken),
                refreshToken = refreshToken.Value

            });

        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _authRepository.FindByEmailAsync(model.Email);
            
            if (user == null)
                return Unauthorized("Invalid email.");

            var passwordCheck = await _authRepository.CheckPasswordAsync(user, model.Password);
          
            if (!passwordCheck)
                return Unauthorized("Invalid password.");

            var checkLocked = await _authRepository.SignInAsync(user, model.Password);
            if (!checkLocked.Succeeded)
                return Unauthorized("Account Locked!");

            var accessToken = await CreateAccessTokenAsync(user);
            var refreshToken = await CreateRefreshTokenAsync(user.Id);

            var token = new JwtSecurityTokenHandler().WriteToken(accessToken);
            HttpContext.Response.Cookies.Append(
                "SESSION_TOKEN",token, new Microsoft.AspNetCore.Http.CookieOptions
                {
                    Expires = DateTime.Now.AddDays(7),
                   
                    Secure = false
                }
                );
        

            return Ok(new { accessToken = token,
                           refreshToken = refreshToken.Value
            
            });
        }


        [HttpPost("Logout")]
        public async Task<IActionResult> Logout([FromBody]string refreshToken)
        {
           
            var refreshTokenDb = await _tokenRepo.FindByValueAsync(refreshToken);

            if (refreshTokenDb is null)
                return NotFound("Refresh Token not found.");

            _tokenRepo.RevokeToken(refreshTokenDb);
            await _uow.CompleteAsync();

            return Ok();
        }
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
        {
          
           
            var refreshTokenDb = await _tokenRepo.FindByValueAsync(refreshToken);

            if (refreshTokenDb is null)
                return NotFound("Refresh Token not found.");

            if (refreshTokenDb.ExpirationDate <= DateTime.UtcNow)
                return BadRequest("Refresh Token is expired.");

            var userDb = await _authRepository.FindByIdAsync(refreshTokenDb.UserId);

            if (userDb is null)
                return NotFound("User not found.");

            _tokenRepo.Refresh(refreshTokenDb);

            var accessToken = await CreateAccessTokenAsync(userDb);

            await _uow.CompleteAsync();

            return Ok(new
            {
                accessToken = new JwtSecurityTokenHandler().WriteToken(accessToken),
                refreshToken = refreshTokenDb.Value
            });
        }


        [HttpPost("ResetPassword")]
        [Authorize]
        public async Task<IActionResult>ResetPassword([FromBody] ResetPasswordViewModel model)
        {
            var result = await _authRepository.ResetPassword(model);
            if (result.Succeeded)
                return  Ok();
           
            return BadRequest(result.Errors);
          
        }

       [HttpPost("UpdateName")]
       [Authorize]
        public async Task<IActionResult> UpdateUserName([FromBody] ApplicationUser user)
        {
            if (string.IsNullOrEmpty(user.FirstName) || string.IsNullOrEmpty(user.LastName))
                return StatusCode(400, "FirstName and LastName are required!");

            var userName = User.Identity.Name;
            user.UserName = userName;
           var result = await _authRepository.UpdateFirstLastName(userName,user.FirstName,user.LastName);
            if (result.Succeeded) return Ok();
            else return BadRequest(result.Errors.ToList());
        }
        [HttpGet("GetName")]
        [Authorize]
        public async Task<IActionResult> GetUserName()
        {
            var userName = User.Identity.Name;
            var user = new ApplicationUser { UserName = userName };
            return  Ok(await _authRepository.GetFirstLastName(user));
            

        }
        #region Render Token
        private async Task<JwtSecurityToken> CreateAccessTokenAsync(ApplicationUser user )
        {
            var claims = await RenderClaimsAsync(user);
            var credentials = RenderCredentials();

            var accessToken = new JwtSecurityToken(
                _config["Token:Issuer"],
                _config["Token:Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(1),
               
                signingCredentials: credentials
            );




            return accessToken;
        }
        private async Task<List<Claim>> RenderClaimsAsync(ApplicationUser user)
        {
            var claims = new List<Claim>();
            claims.Add(new Claim(JwtRegisteredClaimNames.NameId, user.Id));
            claims.Add(new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName));
            claims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email));

            var roles = await _authRepository.GetRolesAsync(user);
            claims.AddRange(roles.Select(r => new Claim("role", r)));

            return claims;
        }
        private SigningCredentials RenderCredentials()
        {
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_config["SecretKey"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            return credentials;
        }


        private async Task<RefreshToken> CreateRefreshTokenAsync(string userId)
        {
            var refreshToken = _tokenRepo.CreateRefreshToken(userId);
            await _uow.CompleteAsync();

            return refreshToken;
        }

        #endregion
    }
}