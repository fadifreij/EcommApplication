using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models.OrderAggregate
{
    public class OrderDetails : BaseEntity
    {
        public int OrderId { get; set; }
        public Orders Order { get; set; }

        public int ItemsId { get; set; }
        public Items Items { get; set; }

        public int Qty { get; set; }


        public double Discount { get; set; }
        public double Price { get; set; }

    }
}
