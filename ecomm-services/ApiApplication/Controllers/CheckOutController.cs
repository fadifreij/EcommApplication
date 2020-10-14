using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiApplication.Core;
using ApiApplication.Models;
using BusinessLayer.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiApplication.Controllers
{
    public class CheckOutController : BaseController
    {
        private readonly IOrderRepository orderRepository;
        private readonly IAuthRepository authRepository;

        public CheckOutController(IOrderRepository orderRepository,IAuthRepository authRepository)
        {
            this.orderRepository = orderRepository;
            this.authRepository = authRepository;
        }


        /// <summary>
        /// CheckOut the Order
        /// </summary>
        ///<remarks>
        /// **POST** /api/CheckOut
        /// <br/>
        ///  { <br/>
        ///    "orderBillingAddress": {  <br/>
        ///        "postCode": "string",  <br/>
        ///        "street": "string",  <br/>
        ///        "country": "string",  <br/>
        ///        "telephone": "string"  <br/>
        ///   }, <br/>
        ///     "orderShippingAddress": {  <br/>
        ///     "postCode": "string",  <br/>
        ///     "street": "string",  <br/>
        ///     "country": "string",  <br/>
        ///     "telephone": "string"  <br/>
        ///      }, <br/>
        ///        "slotDelivery": {  <br/>
        ///        "deliveryDate": "2020-04-14",  <br/>
        ///        "slotNumber": 54254255425,  <br/>
        ///        "slotPrice": 1.5,  <br/>
        ///        "slotName" : [9am-12am] <br/>
        ///        "maxNumberOfDelivery": 10,  <br/>
        ///            }
        ///            }
    /// </remarks>
    [Authorize]
    [HttpPost]
        public  IActionResult Index(CheckoutViewModel model )
        {
            var user = authRepository.FindByUserNameAsync(User.Identity.Name);
            string userId = "";
            if(user!=null)
              userId = user.Result.Id;

            if (string.IsNullOrEmpty(userId)) return BadRequest(" User Id not exists.");

            if (model.SlotDelivery == null) return BadRequest(" Please provide delivery information .");


            long ordernumber;
            try
            {
              
              ordernumber=  orderRepository.CheckOut( model.OrderId,userId, model.OrderBillingAddress, model.OrderShippingAddress, model.SlotDelivery ,model.Card);
              authRepository.UpdateFirstLastName(User.Identity.Name, model.FirstName, model.LastName).Wait();
            }
            catch (Exception ex)
            {

                return BadRequest(ex);
            }
           
            return Created(nameof(this.Index),ordernumber);
        }


    [Authorize]
    [HttpGet("FullSlot")]
    public IActionResult GetFullSlot()
        {
          
            return Ok(orderRepository.GetMaxSlot());
        }

    }
}