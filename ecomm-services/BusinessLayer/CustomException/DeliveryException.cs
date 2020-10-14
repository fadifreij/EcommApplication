using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessLayer.CustomException
{
   public class DeliveryException :Exception
    {
        public DateTime dte { get; set; }
        public DeliveryException(string message) :  base($"Delivery Exception Error : {message}")
        {

        }
    }
}
