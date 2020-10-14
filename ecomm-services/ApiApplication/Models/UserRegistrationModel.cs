using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Models
{
    public class UserRegistrationModel
    {
        [Required]
        [StringLength(maximumLength: 20, ErrorMessage = "Must be at least 3 to 20 characters.", MinimumLength = 3)]
        public string UserName { get; set; }

        [Required]
        [StringLength(maximumLength: 30, ErrorMessage = "Must be at least 8 to 30 characters.", MinimumLength = 8)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        
        [Required]
        [EmailAddress]
        public string Email { get; set; }

    }
}
