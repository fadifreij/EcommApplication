using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DAL.Models
{
   public class MainMenu : BaseEntity
    {
        
        public string MainMenuName { get; set; }
        public bool Show { get; set; }
      
       
        public ICollection<SubMainMenu> SubMainMenu { get; set; }

      

    }
}
