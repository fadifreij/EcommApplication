using DAL.Models.OrderAggregate;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Models
{
   public class Items : BaseEntity
    {
        [NotMapped]
        public string pId { get; set; }
        public string ItemName { get; set; }
        public string ItemLongName { get; set; }
        public bool Show { get; set; }
        public string ItemCode { get; set; }
        public int Qty { get; set; }
        public decimal Discount { get; set; }
        public double Price { get; set; }
        public string ItemDetails { get; set; }
        public string ItemPicturePath { get; set; }


        public int ProductsId { get; set; }
        public Products Products { get; set; }

        public int CurrencyId { get; set; }
        public Currency Currency { get; set; }



        public int CategoryId { get; set; }
        public  Category Category { get; set; }


        public int BrandId { get; set; }
        public Brands Brand { get; set; }

        public int ProductColorId { get; set; }
        public ProductColor ProductColor { get; set; }

        public int SizeId { get; set; }
        public ItemSize Size { get; set; }

       
        public ICollection<ItemImages> Images { get; set; }
        /*
                public ICollection<ItemsThisWeek> ItemsThisWeek { get; set; }
                public virtual ICollection<OrderDetails> ItemsSelected { get; set; }*/



    }


   

    public class  ItemsThisWeek : BaseEntity
    {
        public int ItemsId { get; set; }
        public Items Items { get; set; }
    }
}
