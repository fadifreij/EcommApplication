using DAL.Models.OrderAggregate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Models
{
   public class Orders :BaseEntity
    {
        [Required]
        public string BuyerId { get; set; } // this is ApplicationUserId
       
        [ForeignKey("BuyerId")]
        public ApplicationUser User { get; set; }
       
        public Address ShippingAddress { get; set; }
        public Address BillingAddress { get; set; }
       
        public virtual ICollection<OrderDetails> OrderDetails { get; set; }
        

    }

   
}
