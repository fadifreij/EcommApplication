using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessLayer.CustomException
{
   public class OrderException : Exception
    {
        public int itemId { get; set; }
        public int Qty { get; set; }
      
        public OrderException(string message) :base($"Order Exception Error : {message}")
        {

        }
    }
}
