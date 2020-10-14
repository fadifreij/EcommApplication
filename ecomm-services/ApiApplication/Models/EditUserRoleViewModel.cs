using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Models
{
    public class EditUserRoleViewModel
    {
        public string  UserId { get; set; }
        public bool IsActive { get; set; }

        public List<string> RoleNamesForUser { get; set; }
        public List<string> Roles { get; set; }
    }
}
