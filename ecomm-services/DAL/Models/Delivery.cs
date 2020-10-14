using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Models
{
  public  class Delivery :BaseEntity
    {
        public int OrderId { get; set; } 


        [ForeignKey("OrderId")]
        public Orders OrdersToDelivered { get; set; }
        public DateTime? DeliveryRecievedIn { get; set; }

        public int SlotsId { get; set; }
        public Slots Slots { get; set; }
    }
}
