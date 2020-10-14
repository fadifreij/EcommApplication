using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessLayer.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using ApiApplication.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.DataProtection;

namespace ApiApplication.Controllers
{
   
    public class BasketController : BaseController
    {
        private readonly IBasketRepository basketRepository;
        private readonly IAuthRepository authRepository;
        private readonly IDataProtector _protector;
        public BasketController(IBasketRepository basketRepository , IAuthRepository authRepository, IDataProtectionProvider provider)
        {
            this.basketRepository = basketRepository;
            this.authRepository = authRepository;
            this._protector = provider.CreateProtector("ApiApplication");
        }
        [HttpGet("GetBasket/{BuyerId}")]
        public IActionResult GetBasket(string BuyerId)
        {
            var basket = basketRepository.GetByBuyerId(BuyerId);
            if (basket == null)
                return Ok(null);

            var id = basket.Id;
            var model = basketRepository.GetById(id);
            model.BasketItems =  model.BasketItems.Select(b => { b.Items.pId = _protector.Protect(b.Items.Id.ToString()); return b; }).ToList();
           // model = model.BasketItems.Select(m => { m.Items.pId = _protector.Protect(m.Id.ToString()); return m; });
            return Ok(model);
        }
        
        /// <summary>
        /// Add Update Basket and Basket Items to the system
        /// 
        /// 
        /// </summary>
        /// <remarks>
        ///  **POST** /api/Basket/Save <br/>
        /// { <br/>
        ///   "buyerId": "string", <br/>
        ///   "basketItems": [ <br/>
        ///       { <br/>
        ///          "basketId": 0, <br/>
        ///          "qty": 0, <br/>
        ///          "unitPrice": 0, <br/>
        ///          "discount": 0,  <br/>
        ///           "itemsId": 1,<br/>
        ///           "recentlyViewed":true, <br/>
        ///           "inBasket":false <br/>
        ///            }] <br/>
        ///            }
        /// </remarks>
        [HttpPost("Save")]
      
        public IActionResult AddNewBaskek(Basket basket)
        {
            try
            {



                if (string.IsNullOrEmpty(basket.BuyerId))
                    basket.BuyerId = GetUserId();

                basketRepository.Insert(basket);
                basketRepository.Save();
            }
            catch (Exception ex)
            {

                return BadRequest(ex);
            }
          
              
            return Created("",basket.BuyerId);
        }

        /// <summary>
        /// Delete BasketItem from Basket if all basket items deleted then all the basket will deleted
        /// </summary>
        /// <remarks>
        /// { 
        ///   2 
        /// }
        /// </remarks>
        [HttpDelete("Delete")]
        public IActionResult DeleteBasket([FromBody] int Id)
        {
            basketRepository.DeleteBasketItem(Id);
           
            return Ok();
        }


        private string GetUserId()
        {
           
           
          /*  if( User.Identity.IsAuthenticated )
             return authRepository.FindByUserNameAsync(User.Identity.Name).Result.Id;
            */
           
             return Guid.NewGuid().ToString();
            

            
        }
    }
}