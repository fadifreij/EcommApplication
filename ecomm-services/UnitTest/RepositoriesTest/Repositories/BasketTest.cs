using DAL;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace UnitTest.RepositoriesTest.Repositories
{
   public  class BasketTest : InitializeContext
    {
        ApplicationDbContext context;
        public BasketTest()
        {
             context = InitContext();
        }
        [Fact]
        public void Attach_Test()
        {
            List<BasketItems> items = new List<BasketItems>
            {
               new BasketItems { Id=25,  Qty = 14 , UnitPrice = 3.2 ,  RecentlyViewed  = true , InBasket = false ,ItemsId = 1 },
               new BasketItems { Id=26,  Qty = 5 , UnitPrice = 10  ,   RecentlyViewed  = true , InBasket = false ,ItemsId = 1 }
             //  new BasketItems {  Qty=100 , UnitPrice=100 ,RecentlyViewed =true ,InBasket = false ,ItemsId =1}
                
            };

            Basket basket = new Basket {
                Id = 11,
                BuyerId = "123",
                BasketItems = items
            };
            // add the record  and related table  new records without update the record  and its related table 
            // context.Attach(basket);

            // add track modfied to update the existing records in  record  without updating related table
           // context.Entry(basket).Collection(b => b.BasketItems).IsModified = true; // not working
           // context.Entry(basket).State = EntityState.Modified;
          //  context.Entry(basket).Collection(b => b.BasketItems).IsModified = true;
           
            // update the record and add new and update the related table 
            context.Update(basket);
            
            // context.Basket.Add(basket);
            context.SaveChanges();

        }
        [Fact]
        public void Tracked_Test()
        {

        }
    }
}
