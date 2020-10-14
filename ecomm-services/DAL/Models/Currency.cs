using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
   public class Currency  :BaseEntity
    {
        public string CurrencyName { get; set; }
        public string Symbol { get; set; }
      //  public ICollection<Items> Items { get; set; }
    }
}
