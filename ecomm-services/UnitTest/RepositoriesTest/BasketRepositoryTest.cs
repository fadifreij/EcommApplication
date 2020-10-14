using BusinessLayer.Genric;

using BusinessLayer.Interfaces;
using BusinessLayer.Repositories;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace UnitTest.RepositoriesTest
{
    public class BasketRepositoryTest : InitializeContext
    {
        IBasketRepository _basketRepository;
        IUnitOfWork<BasketItems> _basketItemsRepository;
        public BasketRepositoryTest()
        {
            var context = InitContext();
            _basketItemsRepository = new UnitOfWork<BasketItems>(context);
            _basketRepository = new BasketRepository(context, _basketItemsRepository);
        }

        [Fact]
        public void TestInsertInBasketRepository()
        {

            // for insert
               var bItems = new List<BasketItems>()
               {
                    new BasketItems{ ItemsId = 1 , Qty = 5, UnitPrice = 285 , WhenAdded=  DateTime.Now}
                   , new BasketItems{ ItemsId = 3 ,Qty = 2 ,UnitPrice = 495 ,WhenAdded = DateTime.Now}
               };
              var basketRecord = new Basket { BuyerId = "123", WhenAdded = DateTime.Now, BasketItems = bItems };

            _basketRepository.Insert(basketRecord);
             int? id = basketRecord.Id;
            Assert.NotNull(id);

        }
        [Fact]
        public void UpdateBasket()
        {
            var basketRecord = _basketRepository.GetById(7);
            var basketItems = basketRecord.BasketItems;
             basketItems.Where(p => p.Id == 9).FirstOrDefault().Qty =21;
          //   basketItems.Where(p => p.Id == 2).FirstOrDefault().Qty = 1;
          //  basketItems.Add(new BasketItems { ItemsId = 1, Qty = 7, UnitPrice = 1, Discount = 0 });
            basketRecord.BasketItems = basketItems;
            _basketRepository.Insert(basketRecord);


          int? basketItemsNumber = _basketItemsRepository.GetAll().Count();
            Assert.NotNull(basketItemsNumber);
        }
        [Fact]
        public void TestDeleteFromBasketRepository()
        {
          
            _basketRepository.DeleteBasketItem(8);
            var cnt = _basketItemsRepository.GetAll().Count();

            Assert.Equal(0, cnt);
        }
      
    }
}
