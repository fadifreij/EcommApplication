using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
   public class Basket :BaseEntity
    {
        public string BuyerId { get; set; }


        public virtual ICollection<BasketItems> BasketItems { get; set; }
    }
}
