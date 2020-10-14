using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models.BuyerAggregate
{
  public   class PaymentMethods : BaseEntity
    {
        public string Alias { get; set; }
        public string CardId { get; set; } // actual card data must be stored in a PCI compliant system, like Stripe
        public string Last4 { get; set; }
    }
}
