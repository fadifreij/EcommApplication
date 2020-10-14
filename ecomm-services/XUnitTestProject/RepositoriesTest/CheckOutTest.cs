using BusinessLayer.CustomException;
using BusinessLayer.Genric;

using BusinessLayer.Interfaces;
using BusinessLayer.Repositories;
using DAL.Models;
using System;

using System.Text;
using Xunit;

namespace XUnitTestProject.RepositoriesTest
{
   public class CheckOutTest : InitializeContext
    {
        IOrderRepository _orderRepository;
        IBasketRepository _basketRepository;
        IUnitOfWork<BasketItems> _basketItemsRepository;

        Address OrderBillingAddress;
        Address OrderShippingAddress;
        Slots Slot;
        public CheckOutTest()
        {
            var context = InitContext();
            _orderRepository = new OrderRepository(context);

            _basketItemsRepository = new UnitOfWork<BasketItems>(context);
            _basketRepository = new BasketRepository(context, _basketItemsRepository);



            OrderBillingAddress = new Address { Country = "UK", PostCode = "w3 6bn", Street = "Acton", Telephone = "07400541200" };
            OrderShippingAddress = new Address { Country = "UK", PostCode = "w3 9jq", Street = "Avenu Road", Telephone = "07500851423" };


             Slot = new Slots { MaxNumberOfDelivery = 1, SlotPrice = 1.5m, SlotNumber = 1 , DeliveryDate = DateTime.Parse("2020-04-02")};
        }


        [Fact]
        public void TestCheckout_NeededMoreThanInStock()
        {
            var basket = _basketRepository.GetById(9);
            var UserId = "123";




            Assert.Throws<OrderException>(() => _orderRepository.CheckOut(basket, UserId, OrderBillingAddress, OrderShippingAddress, Slot));

        }
        [Fact]
        public void TestCheckout_SlotIsFull()
        {
            var basket = _basketRepository.GetById(7);
            var UserId = "123";




            Assert.Throws<DeliveryException>(() => _orderRepository.CheckOut(basket, UserId, OrderBillingAddress, OrderShippingAddress, Slot));
        }

        [Fact]
        public void TestCheckout_OK()
        {
            var basket = _basketRepository.GetById(8);
            var UserId = "123";

            _orderRepository.CheckOut(basket, UserId, OrderBillingAddress, OrderShippingAddress, Slot);

            var order = _orderRepository.GetAll();

            Assert.NotNull(order);
        }
    }
}
