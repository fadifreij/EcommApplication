﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
  public  class ApplicationUser :IdentityUser
    {
     
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public virtual ICollection<Orders> Orders { get; set; }
     
       
    }
}
