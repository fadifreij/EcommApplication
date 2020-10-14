using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Models
{
   public class Products :BaseEntity
    {
        public string ProductName { get; set; }
        public bool Show { get; set; }
       public int SubMainMenuId { get; set; }


        [ForeignKey("SubMainMenuId")]
        public SubMainMenu SubMainMenu { get; set; }

        public virtual ICollection<Items> Items { get; set; }
       
    }
}
