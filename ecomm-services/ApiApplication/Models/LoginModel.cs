﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Models
{
    public class LoginModel
    {
       
        public string UserName { get; set; }

        public string Email { get; set; }
        
        public string Password { get; set; }
    }
}
