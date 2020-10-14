using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
   public class CardDetails
    {
        public string CardNumber { get; set; }
        public string ExpiryMonth { get; set; }
        public string ExpiryYear { get; set; }

        public string CVV { get; set; }
    }
}
