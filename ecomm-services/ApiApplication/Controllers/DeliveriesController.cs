using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessLayer.Genric;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiApplication.Controllers
{
    [Authorize(Roles =("staff,admin"))]
    public class DeliveriesController : BaseController
    {
        private readonly IUnitOfWork<Slots> slotRepository;
        private readonly IUnitOfWork<Delivery> deliveryRepository;

        public DeliveriesController(IUnitOfWork<Slots> SlotRepository ,IUnitOfWork<Delivery> DeliveryRepository)
        {
            slotRepository = SlotRepository;
            deliveryRepository = DeliveryRepository;
        }
        [HttpGet("GetSlot")]
        public IActionResult GetAllDeliveriesInSlot(DateTime dte)
        {
            var slots = slotRepository.GetBy(s => s.DeliveryDate == dte).Include(d => d.Deliveries).ToList();
            return Ok(slots);
        }



        [HttpGet("GetDelivery")]
        public IActionResult GetDeleiverInSlot(int Id)
        {
            var delivery = deliveryRepository.GetBy(d => d.Id == Id).Include(d => d.OrdersToDelivered).FirstOrDefault();
            return Ok(delivery);
        }

        [HttpPut("DeliveryReceieved/{Id}")]
        public IActionResult SetDeliveryReceived(int Id)
        {
            var delivery = deliveryRepository.GetById(Id);
            delivery.DeliveryRecievedIn = DateTime.Now;
            deliveryRepository.Update(delivery);
            deliveryRepository.Save();

            return Ok();
        }
    }
}