using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
   public class BasketItems :BaseEntity
    {
        public int BasketId { get; set; }
        public Basket Basket { get; set; }

        public int Qty { get; set; }
        public double UnitPrice { get; set; }

        public double Discount { get; set; }
        public int ItemsId { get; set; }
        public Items Items { get; set; }
        public bool RecentlyViewed { get; set; }
        public bool InBasket { get; set; }

    }
}
