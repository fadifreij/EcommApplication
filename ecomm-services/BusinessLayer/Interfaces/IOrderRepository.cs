using BusinessLayer.Genric;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessLayer.Interfaces
{
   public interface IOrderRepository : IUnitOfWork<Orders>
    {
        Int64 CheckOut(string OrderId, string UserId, Address OrderBillingAddress, Address OrderShippingAddress, Slots SlotDelivery,CardDetails Card);

        IEnumerable<SlotsCapacity> GetMaxSlot();
    }
}
