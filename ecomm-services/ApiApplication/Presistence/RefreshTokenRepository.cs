using ApiApplication.Core;
using DAL;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Presistence
{
    public class RefreshTokenRepository   : IRefreshTokenRepository
    {
        private readonly ApplicationDbContext _db;

        public RefreshTokenRepository(ApplicationDbContext db)
        {
            _db = db;
        }


        public RefreshToken CreateRefreshToken(string userId)
        {
            var refreshToken = new RefreshToken
             {
                 Id = Guid.NewGuid().ToString(),
                 UserId = userId,
                 Value = Guid.NewGuid().ToString(),
              //   ExpirationDate = DateTime.UtcNow.AddHours(12),
                 ExpirationDate=DateTime.UtcNow.AddMinutes(60),
                 TotalRefresh = 0,
                 Revoked = false,
                 
                 CreationTime = DateTime.UtcNow
             };

             _db.RefreshTokens.Add(refreshToken);
            
             return refreshToken;
            
        }

        public async Task<RefreshToken> FindByValueAsync(string value)
        {
            return await _db.RefreshTokens.SingleOrDefaultAsync(rt => !rt.Revoked && rt.Value == value);
        }
        public void Refresh(RefreshToken refreshToken)
        {
            //   refreshToken.ExpirationDate = DateTime.UtcNow.AddHours(12);
            refreshToken.ExpirationDate = DateTime.UtcNow.AddMinutes(60);
            refreshToken.TotalRefresh++;
            refreshToken.LastModified = DateTime.UtcNow;
        }
        public void RevokeToken(RefreshToken refreshToken)
        {
            refreshToken.Revoked = true;
            refreshToken.LastModified = DateTime.UtcNow;
        }

    }
}
