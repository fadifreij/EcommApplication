using BusinessLayer.Genric;
using BusinessLayer.Interfaces;
using DAL;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessLayer.Repositories
{
   public class BasketRepository : UnitOfWork<Basket>, IBasketRepository
    {
        private readonly ApplicationDbContext db;
        private readonly IUnitOfWork<BasketItems> basketItemsRepo;
      

        public BasketRepository(ApplicationDbContext db ,IUnitOfWork<BasketItems> basketItemsRepo  ) :base(db)
        {
            this.db = db;
            this.basketItemsRepo = basketItemsRepo;
           
        }

       

        public Basket GetByBuyerId(string BuyerId)
        {
           return db.Basket.Where(b => b.BuyerId == BuyerId).FirstOrDefault();

        }

        public override Basket GetById(object id)
        {
         
            var basketRec = db.Basket.Include(b => b.BasketItems).ThenInclude(p=>p.Items).ThenInclude(i=>i.Images).Where(b => b.Id == (int)id).FirstOrDefault();
          
            return basketRec;
        }
        public override void Insert(Basket obj)
        {
                                  
           Basket  basket = GetByBuyerId(obj.BuyerId);

            if(basket == null)
            {
             
               base.Insert(obj);
               Save();
            }
           if(obj.BasketItems != null)
            {
                var basketItems = obj.BasketItems.ToList();
                 
              foreach(var basketItem in basketItems)
                {
                    if (basketItem.Id == 0)
                    {
                        //  basketItem.Id = basket.Id;
                       
                          basketItemsRepo.Insert(basketItem);

                    }

                    else
                    {
                        if (basketItem.Qty == 0 && !basketItem.RecentlyViewed)
                        {//  basketItemsRepo.Delete(basketItem.Id);
                            DeleteBasketItem(basketItem.Id);
                        }
                        else

                            basketItemsRepo.Update(basketItem);
                    }
                }
                
             // use aggregate for opperation only and not to implement function for each element 
             // because  if you have 3 element the function will executed twice  and not three times
             /*
                var k = basketItems.Aggregate((current, next) =>
                {
                   
                    if(current.Id == 0)
                      basketItemsRepo.Insert(current);
                    else
                     basketItemsRepo.Update(current);
                       
                   
                   
                    return next ;
                });
                */
               

                basketItemsRepo.Save();
            }
            
           


        }
        public void DeleteBasketItem(int id)
        {
            BasketItems basketItem = basketItemsRepo.GetById(id);
            if (basketItem == null)
                return;
            // check if it is favorite should not delete the record just update the record to zero and put inbasket to false
            if (basketItem.RecentlyViewed && basketItem.Qty !=0)
            {
                basketItem.Qty = 0;
                basketItem.InBasket = false;
                db.BasketItems.Update(basketItem);
                db.SaveChanges();
                return;
            }
            var basketId = basketItem.BasketId;
            basketItemsRepo.Delete(id);
            basketItemsRepo.Save();
            var basketItems = db.Basket.Include(p => p.BasketItems).Where(p => p.Id == basketId).FirstOrDefault();
            if(basketItems ==null || basketItems.BasketItems.Count == 0)
            {

              
                base.Delete(basketId);
                base.Save();
            }
        }

    }
}
