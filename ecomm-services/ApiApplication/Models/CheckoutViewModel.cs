using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Models
{
    public class CheckoutViewModel
    {
        public string OrderId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Address OrderBillingAddress { get; set; }

        public Address  OrderShippingAddress { get; set; }
        public Slots SlotDelivery { get; set; }
        public CardDetails Card { get; set; }
    }
}
