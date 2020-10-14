using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using ApiApplication.Models;
using BusinessLayer.Genric;
using BusinessLayer.Genric.PagingOrderingSpecification;
using BusinessLayer.Genric.Specification;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace ApiApplication.Controllers
{
   // [Authorize(Roles = "Staff,Admin")]
    public class MainMenuController :BaseController
    {
        private readonly IUnitOfWork<MainMenu> mainmenuRepo;
        private readonly IMemoryCache _cache;

        public MainMenuController(IUnitOfWork<MainMenu> mainmenuRepo ,
                                  IMemoryCache memoryCache)
        {
            this.mainmenuRepo = mainmenuRepo;
            _cache = memoryCache;
        }


        /// <summary>
        /// Get The MainMenu with Show = true
        /// </summary>
        [AllowAnonymous]
        [HttpGet("GetAllActive")]
        public IActionResult GetAllActiveMainMenu()
        {
           
                IEnumerable<MainMenu> model;
                if (!_cache.TryGetValue("MainMenuItemCache", out model))
                {
                    // key MainMenuItemCache not in cache so get the data

                    //Displaying multi level navigation property
                    model = mainmenuRepo.GetAll()
                        .Include(m => m.SubMainMenu)
                        .ThenInclude(b => b.Products)
                        .Where(p => p.Show == true).ToList();

                    // Set cache options.
                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        // Keep in cache for this time, reset time if accessed.
                        .SetSlidingExpiration(TimeSpan.FromHours(10));

                    // Save data in cache.
                    _cache.Set("MainMenuItemCache", model, cacheEntryOptions);
                }

                return Ok(model);
            
          
           
        }
        
        /// <summary>
        ///  Return All the MainMenu
        /// </summary>
        /// <response code="200"> All the Main Menu loaded Successfully </response>
        
        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            try
            {
                
                var model = mainmenuRepo.GetAll()
                 .Include(m => m.SubMainMenu)
                 .ToList();
                return Ok(model);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            
        }

       

        /// <summary>
        ///  Adding or update MainMenu to the system
        /// </summary>
        /// <remarks>
        /// Sample requests :
        /// 
        ///  **POST** /api/MainMenu/Add
        ///  
        ///      {    
        ///           "Id" : 1   // if add new do not put Id
        ///           "mainMenuName" : "test",
        ///           "show" : true
        ///    
        ///      }
        /// </remarks>
        /// <param name="menu"></param>
        /// <response code ="201"> MainMenu Created </response>
        /// <response code ="200"> MainMenu Updated </response>
        /// <response code ="400"> Unable to Create MainMenu due to validation error</response>
        [HttpPost("Add")]
        public IActionResult AddMainMenu([FromBody] MainMenu menu)
        {
           
             if(menu.Id == 0)
             {
                mainmenuRepo.Insert(menu);
                mainmenuRepo.Save();
             
            }
            else
            {
                mainmenuRepo.Update(menu);
                mainmenuRepo.Save();
             //   return Ok();
            }

            return RedirectToAction("GetAll");

            //  return Ok();
        }




        /// <summary>
        /// Deleting MainMenu from the system
        /// </summary>
        /// <remarks>
        ///  **DELETE** /api/MainMenu/Delete
        ///  
        ///     2
        /// 
        /// 
        /// </remarks>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpDelete("Delete")]
        public IActionResult DeleteMainMenu([FromBody]int Id)
        {

            if (Id == 0)
            {
                return BadRequest("Menu Name Id cannot be zero");
            }

            var mainmenu = mainmenuRepo.GetById(Id);
            if (mainmenu == null)
            {
                return BadRequest("Menu Name not found");
            }

            mainmenuRepo.Delete(Id);
            mainmenuRepo.Save();
            return Ok(mainmenuRepo.GetAll());
        }




    }
}