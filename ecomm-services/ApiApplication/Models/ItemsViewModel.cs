using DAL.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Models
{
    public class ItemsViewModel : Items
    {
     
        public IFormFile FavoriteImage { get; set; }

        public List<IFormFile> listOfImages { get; set; }
        public bool IsImageChange { get; set; }
        public bool IsListChange { get; set; }
    }
}
