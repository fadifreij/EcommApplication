using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessLayer.Genric;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace ApiApplication.Controllers
{
    public class ItemsThisWeekController : BaseController
    {
        private readonly IUnitOfWork<ItemsThisWeek> itemsThisWeekRepo;

        public ItemsThisWeekController(IUnitOfWork<ItemsThisWeek> itemsThisWeekRepo)
        {
            this.itemsThisWeekRepo = itemsThisWeekRepo;
        }
        /// <summary>
        ///  Adding  This week Items
        /// </summary>
        /// <remarks>
        ///  **POSt** /api/ItemsThisWeek/Add
        ///   { 
        ///     "itemsId": 2
        ///    }
        /// </remarks>

        [HttpPost("Add")]
        public IActionResult AddNewItem(ItemsThisWeek item)
        {
            itemsThisWeekRepo.Insert(item);
            itemsThisWeekRepo.Save();
            return Ok();
        }

        /// <summary>
        ///  Delete  This week Items
        /// </summary>
        /// <remarks>
        ///  **DELETE** /api/ItemsThisWeek/Delete
        ///   { 
        ///      2
        ///    }
        /// </remarks>
        [HttpDelete("Delete")]
        public IActionResult DeleteItem([FromBody]int Id)
        {
            itemsThisWeekRepo.Delete(Id);
            itemsThisWeekRepo.Save();
            return Ok();
        }
    }
}