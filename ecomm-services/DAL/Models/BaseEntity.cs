using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
   public class BaseEntity
    {
        public int Id { get; set; }
        public DateTime WhenAdded { get; set; }
    }
}
