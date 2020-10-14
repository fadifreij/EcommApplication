using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiApplication.Models;
using BusinessLayer.Genric;
using BusinessLayer.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;

namespace ApiApplication.Controllers

{  
   

  //  [Authorize(Roles ="Staff,Admin")]
    public class ItemsController : BaseController
    {
        private readonly IItemRepository itemsRepository;
        private readonly IDataProtector _protector;

        public ItemsController(IItemRepository itemsRepository
                                , IDataProtectionProvider provider)
        {
            this.itemsRepository = itemsRepository;
            this._protector = provider.CreateProtector("ApiApplication");
        }



        /// <summary>
        ///  Add New Items 
        /// </summary>
        /// <remarks>
        /// Sample requests :
        ///  **POST**  /api/Items/Add
        ///   
        ///   { 
        ///       "Id" : 1 ,// do not  add id when inserting <br/>
        ///       "ItemName" : "test- item name",  <br/>
        ///       "ItemLongName" : "test - long name ", <br/>
        ///       "Show" : true , <br/>
        ///       "ItemCode" : "12525425225", <br/>
        ///       "Qty"  : 2, <br/>
        ///       "Discount" : 0.32, <br/>
        ///       "Price" : 38.2, <br/>
        ///       "ItemDetails" : "test- item detail", <br/>
        ///       "ProductsId" : 1, <br/>
        ///       "CurrencyId" : 1, <br/>
        ///       "CategoryId" : 1,
        ///       "BrandId" : 1,  <br/>
        ///       "ProductColorId" : 1, <br/>
        ///       "SizeId" : 1, <br/>
        ///       "FavoriteImage" : image, <br/>
        ///       "Images" : List of images <br/>
        ///     }  
        ///       
        /// </remarks>
        /// 
        ///<response code ="200"> Items Inserted Successfully</response>
        ///<response code="400"> Unable to Create new Item</response>

        [HttpPost]
        [Route("Add")]
        public IActionResult AddNewItem([FromForm] ItemsViewModel model)
        {

          //  ItemsViewModel model

            try
            {
                 itemsRepository.AddItem(model, model.FavoriteImage, model.listOfImages, model.IsImageChange, model.IsListChange);
                
            }
            catch (Exception ex)
            {

                return BadRequest(ex);
            }

            return Ok();
        }

        [HttpGet("GetAll/{id}")]
        public IActionResult GetAll(int id)
        {
            var model = itemsRepository.GetAll()
                .Include(img => img.Images)
                .Include(cat => cat.Category)
                .Include(brnd => brnd.Brand)
                .Include(col => col.ProductColor)
                .Include(sze => sze.Size)

                .Where(I => I.ProductsId == id).ToList();


            return Ok(model);
        }
        [AllowAnonymous]
        [HttpGet("GetAllLike/{ItemName}")]
        public IActionResult GetAllItemLike(string ItemName)
        {
            var model = itemsRepository.GetAll()
              //  .Include(img => img.Images)
              //  .Include(cat => cat.Category)
              //  .Include(brnd => brnd.Brand)
              //  .Include(col => col.ProductColor)
              //  .Include(sze => sze.Size)

                .Where(I => I.ItemName.Contains(ItemName)).ToList();

          model =  model.Select(p => { p.pId = _protector.Protect(p.Id.ToString()); return p; }).ToList();
            return Ok(model);
        }
        [AllowAnonymous]
        [HttpGet("GetItemByPId/{pid}")]
        public IActionResult GetByPId(string pid)
        {
            var id = _protector.Unprotect(pid);
            
            var model = itemsRepository.GetBy(i => i.Id == int.Parse(id))
            //    .Include(cat => cat.Category)
            //    .Include(brnd => brnd.Brand)
           //     .Include(col => col.ProductColor)
           //     .Include(sze => sze.Size)
                .Include(p=>p.Products).ThenInclude(s=>s.SubMainMenu).ThenInclude(m=>m.MainMenu)
                .Include("Images");
            return Ok(model);
        }

        [HttpGet("GetItem/{id}")]
        public IActionResult GetById(int id)
        {
           

            var model = itemsRepository.GetBy(i => i.Id == id)
                .Include(cat => cat.Category)
                .Include(brnd => brnd.Brand)
                .Include(col => col.ProductColor)
                .Include(sze => sze.Size)
                .Include("Images");
            return Ok(model);
        }

        [HttpGet("GetKeyTables")]
        public IActionResult GetKeyTables()
        {
            var model = itemsRepository.GetKeyTables();
            return Ok(model);
        }




        [HttpDelete("Delete")]
        public IActionResult DeleteItem([FromBody]int Id)
        {
            if (Id == 0)
                return BadRequest("Item Id cannot be zero");

            var item = itemsRepository.GetById(Id);
            if (item == null)
            {
                return BadRequest("Menu Name not found");
            }

            itemsRepository.Delete(Id);
            itemsRepository.Save();
            return Ok();
        }
    }
}