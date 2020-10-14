using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Models
{
    public class ErrorViewModel
    {
        public string ErrorDescription { get; set; }
        public IEnumerable<IdentityError> Errors { get; set; }
    }
    
}
