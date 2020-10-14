using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    [Owned]
  public  class Address
    {
        public string PostCode { get; set; }
        public string Street { get; set; }
        public string Country { get; set; }
        public string Telephone { get; set; }
    }
}
