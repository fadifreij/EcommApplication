using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class ItemImages : BaseEntity
    {
        public string ImagePath { get; set; }
        
        public int ItemId {get;set;}
        public Items Item { get; set; }
    }
}
