using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BusinessLayer.Genric;
using BusinessLayer.Genric.Specification;
using BusinessLayer.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace ApiApplication.Controllers
{
  //  [Authorize(Roles ="Admin,Staff")]
    public class ProductsController : BaseController
    {
        private readonly IUnitOfWork<Products> productsRepo;
        private readonly IItemRepository itemsRepo;
        private readonly IImageManaging imageRepo;
        private readonly IMemoryCache _cache;
        private readonly IDataProtector _protector;
        public ProductsController(IUnitOfWork<Products> productsRepo 
                                , IItemRepository ItemsRepo 
                                ,IImageManaging imageRepo
                                , IMemoryCache memoryCache
                                , IDataProtectionProvider provider
                                 )
        {
            this.productsRepo = productsRepo;
            itemsRepo = ItemsRepo;
            this.imageRepo = imageRepo;
            _cache = memoryCache;

            _protector = provider.CreateProtector("ApiApplication");
        }
     /// <summary>
     ///  Get All Active Products for Main Menu 
     /// </summary>
     /// <remarks>
     ///  **GET** /api/Products/GetAllActive
     /// </remarks>
       [AllowAnonymous]
       [HttpGet]
       [Route("GetAllActive")]
        public IActionResult GetAllActiveProducts()
        {
            var model = productsRepo.GetAll(p => p.SubMainMenu, p => p.SubMainMenu.MainMenu).Where(p=>p.Show == true);
         
            return Ok(model);
        }


        /// <summary>
        ///  Get All  Products for admin Page to update the products name 
        /// </summary>
        /// <remarks>
        ///  **GET** /api/Products/GetAll
        /// </remarks>

        [HttpGet]
        [Route("GetAll/{id}")]
        public IActionResult GetAllProducts(int id)
        {
            var model = productsRepo.GetAll().Where(p=>p.SubMainMenuId == id);
            return Ok(model);
        }

        /// <summary>
        ///  Get All Items in Product for MainMenu Page  
        /// </summary>
        /// <remarks>
        ///  **GET** /api/Products/GetItemsForProduct/{ProductId}
        ///  
        ///  <br/>
        ///   **Optional Parameter**<br/>
        ///   <paramref name="CategoryId"/><br/>
        ///   <paramref name="BrandId"/><br/>
        ///   <paramref name="ProductColorId"/><br/>
        ///   <paramref name="SizeId"/><br/>
        ///   <paramref name="skip"/><br/>
        ///   <paramref name="take"/><br/>
        ///   <paramref name="OrderbyName"/> -- (name,price) <br/>
        ///   <paramref name="OrderBy"/> -- (asc,desc)
        ///  
        /// </remarks>
        [AllowAnonymous]
        [HttpGet]
        [Route("GetItemsForProduct/{MainMenuName}/{SubMainMenuName}/{ProductName}")]
        public IActionResult GetItemsForProduct(string MainMenuName,string SubMainMenuName,string ProductName,
                                                int? CategoryId,
                                                string BrandId ,
                                                string ProductColorId,string SizeId ,
                                                int? skip,int? take,string OrderbyName ,string OrderBy)
        {
            OrderByEnum OrderByType = (string.IsNullOrEmpty(OrderBy) || OrderBy.ToLower() == "asc") ? OrderByEnum.asc : OrderByEnum.desc;
            ItemsOrder OrderByField = (string.IsNullOrEmpty(OrderbyName) || OrderbyName.ToLower() == "name") ? ItemsOrder.ItemName : ItemsOrder.Price;

            IEnumerable<Items> model;

            MainMenuName = WebUtility.HtmlDecode(MainMenuName);
            SubMainMenuName = WebUtility.HtmlDecode(SubMainMenuName);
            ProductName = WebUtility.HtmlDecode(ProductName);

            var Product = productsRepo.GetAll().Include(s => s.SubMainMenu).ThenInclude(m => m.MainMenu)
                 .Where(p => p.SubMainMenu.MainMenu.MainMenuName == MainMenuName
                             && p.SubMainMenu.SubMainMenuName == SubMainMenuName
                             && p.ProductName == ProductName).FirstOrDefault();
            if (Product == null)
                return BadRequest("PATH NOT EXIST");
            var ProductId = Product.Id;
            model = itemsRepo.ListAll(ProductId,null, CategoryId, BrandId, ProductColorId, SizeId, skip, take, OrderByField, OrderByType);

            model = model.Select(m => { m.pId = _protector.Protect(m.Id.ToString()); return m; });
            
            return Ok(model);
        }
        /// <summary>
        /// Add - Update Product to the system
        /// </summary>
        /// <remarks>
        /// **POST**  /api/Products/Add
        /// <br/>
        ///  {
        ///    "Id" : 1 // do not put Id on new product <br/>
        ///    "productName": "string",<br/>
        ///    "show": true, <br/>
        ///    "subMainMenuId": 0 <br/>
        ///       }
        ///  
    /// </remarks>
    /// <returns></returns>
    [HttpPost("Add")]
        public IActionResult AddProduct(Products product)
        {
            if (product.Id == 0)
                productsRepo.Insert(product);
            else
            {
                var model = productsRepo.GetAll().Include(p => p.SubMainMenu).Where(p => p.Id == product.Id).FirstOrDefault();
                model.ProductName = product.ProductName;
                model.Show = product.Show;
              
                productsRepo.Update(model);
            }
            productsRepo.Save();
            var result = productsRepo.GetAll().Where(p => p.SubMainMenuId == product.SubMainMenuId);
            return Ok(result);
        }

        /// <summary>
        /// Delete Product from System
        /// </summary>
        /// <remarks>
        ///  **DELETE**  /api/Products/Delete
        /// <br/>
        /// { 1
        ///  }
        /// 
        /// </remarks>
        [HttpDelete("Delete")]
       public IActionResult DeleteProduct([FromBody]int Id)
        {
            if (Id == 0) return BadRequest("Product Id cannot be zero");

            var product = productsRepo.GetById(Id);
            if(product ==null) return BadRequest("Product not exists.");

            imageRepo.DeleteProductFolder(product.ProductName);
            productsRepo.Delete(Id);
            productsRepo.Save();

            var result = productsRepo.GetAll().Where(p => p.SubMainMenuId == product.SubMainMenuId);
            return Ok(result);
        }
    }
}