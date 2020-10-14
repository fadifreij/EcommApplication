using BusinessLayer.Genric;

using DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessLayer.Interfaces
{
   public interface IBasketRepository :IUnitOfWork<Basket>
    {
        Basket GetByBuyerId(string BuyerId);
        void DeleteBasketItem(int id);
    }
}
