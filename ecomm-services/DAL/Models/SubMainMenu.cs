using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Models
{
  public  class SubMainMenu :BaseEntity
    {
        public string SubMainMenuName { get; set; }

        public bool Show { get; set; }
        public int MainMenuId { get; set; }
        [ForeignKey("MainMenuId")]
        public MainMenu MainMenu { get; set; }

    
        public virtual ICollection<Products> Products { get; set; }
    }
}
