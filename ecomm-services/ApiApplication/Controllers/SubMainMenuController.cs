using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessLayer.Genric;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiApplication.Controllers
{
  //  [Authorize(Roles = "Staff,Admin")]
    public class SubMainMenuController : BaseController
    {
        private readonly IUnitOfWork<SubMainMenu> submainmenuRepo;

        public SubMainMenuController(IUnitOfWork<SubMainMenu> submainmenu )
        {
            this.submainmenuRepo = submainmenu;
        }
        [HttpGet("GetAllActive")]
        public IActionResult GetAllActiveSubMainMenu()
        {
            var model = submainmenuRepo.GetAll(p => p.MainMenu).Where(p=>p.Show==true);
            return Ok(model);
        }
       
        [HttpGet("GetAll/{Id}")]
        public IActionResult GetAllSubMainMenu(int Id)
        {
            var model = submainmenuRepo.GetAll()
                .Include(p=>p.Products)
                .Where(p=>p.MainMenuId==Id);
            return Ok(model);
        }


        /// <summary>
        ///    Adding SubMainMenu and the Id of mainmenu that linked to
        /// </summary>
        /// <remarks>
        /// **POST** /api/SubMainMenu/Add
        ///      {
        ///          "Id" : 1  // do not put Id if you add 
        ///          "subMainMenuName": "string",
        ///          "show": true,
        ///          "mainMenuId" : 1
        /// 
        ///      }
        /// 
        /// </remarks>
        /// <param name="submainmenu"></param>
        /// <returns></returns>
        [HttpPost("Add")]
        public IActionResult AddSubMainMenu([FromBody] SubMainMenu submainmenu)
        {
            if (submainmenu.Id == 0)
            { submainmenuRepo.Insert(submainmenu);
                submainmenuRepo.Save();
               // return Created("", submainmenu.Id);
            }
            else
            {
                //solve update problem
                var model = submainmenuRepo.GetAll().Include(p => p.MainMenu).Where(p => p.Id == submainmenu.Id).FirstOrDefault();
                model.SubMainMenuName = submainmenu.SubMainMenuName;
                model.Show = submainmenu.Show;
                submainmenuRepo.Update(model);

                submainmenuRepo.Save();

              //  return Ok();
            }

            var result = submainmenuRepo.GetAll().Where(p => p.MainMenuId == submainmenu.MainMenuId);
            return Ok(result);

        }
        [HttpDelete("Delete")]
        public IActionResult DeleteSubMainMenu([FromBody] int Id)
        {
            if(Id == 0)  return BadRequest("SubMenu Name Id cannot be zero");
            

            var submainmenu = submainmenuRepo.GetById(Id);
            if (submainmenu == null) return BadRequest("SubMainMenu not exists.");


            submainmenuRepo.Delete(Id);
            submainmenuRepo.Save();

            var result = submainmenuRepo.GetAll().Where(p => p.MainMenuId == submainmenu.MainMenuId);
            return Ok(result);
        }
    }
}