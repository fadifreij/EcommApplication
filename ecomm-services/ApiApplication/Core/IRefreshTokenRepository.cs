using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Core
{
  public  interface IRefreshTokenRepository
    {
        RefreshToken CreateRefreshToken(string userId);
        Task<RefreshToken> FindByValueAsync(string value);
        void Refresh(RefreshToken refreshToken);
        void RevokeToken(RefreshToken refreshToken);
    }
}
