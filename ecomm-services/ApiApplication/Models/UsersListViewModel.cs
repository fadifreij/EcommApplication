using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Models
{
    public class UsersListViewModel
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string LockoutEnd { get; set; }
        public List<string> RoleNamesForUser { get; set; }
        public List<UserRolesViewModel> Roles { get; set; }


    }
}
