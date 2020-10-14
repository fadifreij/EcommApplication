using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiApplication.Core;
using BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiApplication.Controllers
{
    public class OrderController : BaseController
    {
        private readonly IOrderRepository orderRepository;
        private readonly IAuthRepository authRepository;

        public OrderController(IOrderRepository orderRepository,IAuthRepository authRepository)
        {
            this.orderRepository = orderRepository;
            this.authRepository = authRepository;
        }
      [Authorize]
      [HttpGet("GetOrders")]
        public async Task<IActionResult> Index()
        {
            var user = await authRepository.FindByUserNameAsync(User.Identity.Name);
            if (user == null)
                return BadRequest("no username ");


            var id = user.Id;

            var model = orderRepository.GetBy(p => p.BuyerId == id).Include(p => p.OrderDetails).ThenInclude(i=>i.Items).ToList();
            return Ok(model);
        }
    }
}