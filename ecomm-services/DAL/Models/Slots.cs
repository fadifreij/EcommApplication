using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Models
{
   public class Slots :BaseEntity
    {

        [Column(TypeName = "date")]
        public DateTime  DeliveryDate { get; set; }
        public int SlotNumber { get; set; }

        public decimal SlotPrice { get; set; }

        public int MaxNumberOfDelivery { get; set; }
        public string SlotName { get; set; }


        public ICollection<Delivery> Deliveries { get; set; }
    }


    public class SlotsCapacity
    {
        public DateTime DeliveryDate  { get; set; }
        public int MaxNumber { get; set; }
        public int MaxNumberOfDelivery { get; set; }
        public string SlotName { get; set; }

    }
}
