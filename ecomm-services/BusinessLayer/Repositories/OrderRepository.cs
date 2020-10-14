using BusinessLayer.CustomException;
using BusinessLayer.Genric;
using BusinessLayer.Interfaces;
using DAL;
using DAL.Models;
using DAL.Models.OrderAggregate;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessLayer.Repositories
{
  public  class OrderRepository : UnitOfWork<Orders>, IOrderRepository
    {
        private readonly ApplicationDbContext db;
        private readonly IBasketRepository basketRepository;

        public OrderRepository(ApplicationDbContext db,
                            IBasketRepository basketRepository) :base(db)
        {
            this.db = db;
            this.basketRepository = basketRepository;
        }




        // parameters for checkout 
        // Basket 
        // User 
        //payment detail
        // we need the Items to check the qty for each item
        //we need the slot to check if maximum delivery acheived other wise increase it one by adding delivery in 
        // deleiveries table
        // if payment authorized  delete basket table 


        public Int64 CheckOut(string OrderId, string UserId, Address OrderBillingAddress, Address OrderShippingAddress, Slots SlotDelivery, CardDetails Card)
        {
            var strategy = db.Database.CreateExecutionStrategy();
            var ReceiptId = 0;
            strategy.Execute(() => { 
            using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        // do this to lock the record items selected from customer by shopping basket 

                        //  string sqlQuery = "select * from Items with (ReadPast,xlock,rowlock,holdlock) where Id in (1,2)";

                        
                        // holdlock  it is shared lock allow to read but not update untill the transaction finished
                        //xlock not allow to read neither update untill the transaction finished
                        var basket = basketRepository.GetBy(b => b.BuyerId == OrderId,p=>p.BasketItems).FirstOrDefault();
                        if (basket == null) throw new OrderException("No order to checkout");

                        var listofItemsId = basket.BasketItems.Select(b => b.ItemsId);

                        string criteria = listofItemsId.Aggregate("", (current, next) =>
                        {
                            if (current != "")
                                current = current + ", " + next.ToString();
                            else
                                current = next.ToString();
                            return current;
                        });
                        string sqlQuery = $"select * from Items with (xlock) where Id in ({criteria})";
                        var records = db.Items.FromSqlRaw(sqlQuery).ToList();





                        // check the quantity if available to each item in the basket
                        // and change the stock if available and item needed less than the Qty of Stock
                        foreach (var item in basket.BasketItems)
                        {
                            var ItemInStock = db.Items.Where(i => i.Id == item.ItemsId).FirstOrDefault();

                            if (ItemInStock == null)
                            {
                                // transaction.Rollback();
                                throw new OrderException($"Item Id : {item.ItemsId} finished from the stock ") { itemId = item.ItemsId , Qty = 0};
                            }

                            if (item.Qty > ItemInStock.Qty)
                            {
                                // transaction.Rollback();
                                throw new OrderException($"Item Id : {item.ItemsId} more than  the stock ") { itemId = item.ItemsId ,Qty = ItemInStock.Qty };

                            }

                            ItemInStock.Qty = ItemInStock.Qty - item.Qty;
                            db.SaveChanges();
                        }


                        // do the payment from third party if not successfull do rollback 
                        // and if successfull proceed to delivery and add new order 

                        // after order and payment succeeded we have to register the order  and delivery 
                        //check the slot before add the order if slot unavalable rollback



                        //add slot if not exist 
                        var slotExist = db.Slots.Where(s => s.DeliveryDate == SlotDelivery.DeliveryDate && s.SlotName == SlotDelivery.SlotName).FirstOrDefault();
                        int slotId = -1;
                        if (slotExist != null)
                        {
                            slotId = slotExist.Id;
                        }
                        else
                        {
                         
                            db.Slots.Add(SlotDelivery);
                            db.SaveChanges();
                            slotId = SlotDelivery.Id;
                        }


                        //do this lock to add new delivery while i am updating deliveries table to get the number of deliveies to decide if it is full or not if full rollback
                        sqlQuery = $"select * from Deliveries with (holdlock) where SlotsId = {slotId}";
                        var slotMaxDelivery = db.Deliveries.FromSqlRaw(sqlQuery).ToList();

                        var deliveriesInSlot = db.Deliveries.Where(s => s.SlotsId == slotId);



                        if (deliveriesInSlot.Count() + 1 <= SlotDelivery.MaxNumberOfDelivery)
                        {
                            //save the order from basket 

                            var neworder = new Orders
                            {
                                BuyerId = UserId,
                                BillingAddress = OrderBillingAddress,
                                ShippingAddress = OrderShippingAddress
                            };
                            //insert orderdetail from basketdetail
                            var listOrderDetail = new List<OrderDetails>();
                            foreach (var orderdetail in basket.BasketItems)
                            {
                                var odetail = new OrderDetails
                                {
                                    ItemsId = orderdetail.ItemsId,
                                    Qty = orderdetail.Qty,
                                    Discount=orderdetail.Discount,
                                    Price = orderdetail.UnitPrice
                                };
                                listOrderDetail.Add(odetail);
                            }
                            neworder.OrderDetails = listOrderDetail;
                            db.Orders.Add(neworder);
                            db.SaveChanges();


                            // delete items from shopping basket after adding it in Orders
                            db.Basket.Remove(basket);
                            db.SaveChanges();


                            var deliveryRecord = new Delivery
                            {
                                SlotsId = slotId,
                                OrderId = neworder.Id
                            };
                            db.Deliveries.Add(deliveryRecord);
                            db.SaveChanges();

                            transaction.Commit();
                            ReceiptId = neworder.Id;
                        }
                        else
                        {
                            // transaction.Rollback();
                            throw new DeliveryException($"Slot Id : {slotId}  is full ") { dte = SlotDelivery.DeliveryDate };

                        }


                    }

                    catch (Exception ex)
                    {

                        /*   Console.WriteLine("Commit Exception Type: {0}", ex.GetType());
                           Console.WriteLine("  Message: {0}", ex.Message);
     */
                        // Attempt to roll back the transaction.

                        transaction.Rollback();
                        throw ex;


                        /* catch (Exception ex2)
                         {
                             // This catch block will handle any errors that may have occurred
                             // on the server that would cause the rollback to fail, such as
                             // a closed connection.
                             Console.WriteLine("Rollback Exception Type: {0}", ex2.GetType());
                             Console.WriteLine("  Message: {0}", ex2.Message);
                         }*/
                    }
                }





            });

            return ReceiptId;

            //  string connectionString = "";

            /*  using (SqlConnection  connection = new SqlConnection(connectionString))
              {
                  connection.Open();

                  SqlCommand selectCommand = connection.CreateCommand();
                  SqlCommand updateCommand = connection.CreateCommand();
                  SqlTransaction transaction = connection.BeginTransaction("CheckOutTransaction");

                  selectCommand.Connection = connection;
                  updateCommand.Connection = connection;
                  updateCommand.Transaction = transaction;
                  try
                  {

                      // check if the quantity of items in the basket are available in stock
                      var basketItems = basket.BasketItems;
                      foreach(var item in basketItems)
                      {
                          selectCommand.CommandText = $"select Qty from Items where Id ={item.ItemsId}";
                          var reader = selectCommand.ExecuteReader();
                          if (reader.Read())
                          {
                              if ((int)reader["Qty"] >= item.Qty)
                              {
                                  var newQty = (int)reader["Qty"] - item.Qty;
                                  updateCommand.CommandText = $"update Items set Qty = {newQty} where Id ={item.ItemsId}";
                                  updateCommand.ExecuteNonQuery();
                              }
                              else
                              {
                                 // if number of requested item is more than on the stock
                                  transaction.Rollback();
                                  throw new OrderException($"Item Id : {item.ItemsId} needed more than in the stock ") {  itemId = item.ItemsId};
                              }
                          }
                          else
                          {
                              transaction.Rollback();
                              throw new OrderException($"Item Id : {item.ItemsId} are not exists in table Items ");
                          }

                      }

                  }
                  catch (Exception ex)
                  {

                      Console.WriteLine("Commit Exception Type: {0}", ex.GetType());
                      Console.WriteLine("  Message: {0}", ex.Message);

                      // Attempt to roll back the transaction.
                      try
                      {
                          transaction.Rollback();
                      }
                      catch (Exception ex2)
                      {
                          // This catch block will handle any errors that may have occurred
                          // on the server that would cause the rollback to fail, such as
                          // a closed connection.
                          Console.WriteLine("Rollback Exception Type: {0}", ex2.GetType());
                          Console.WriteLine("  Message: {0}", ex2.Message);
                      }
                  }
              }*/
        }


        public IEnumerable<SlotsCapacity> GetMaxSlot()
        {
            var slots = db.Slots.Include(s => s.Deliveries)
                        .Select(d => new SlotsCapacity
                        {
                            DeliveryDate = d.DeliveryDate,
                            SlotName = d.SlotName,
                            MaxNumberOfDelivery = d.MaxNumberOfDelivery,
                            MaxNumber = d.Deliveries.Count

                        })
                        .Where(l=>l.MaxNumber ==l.MaxNumberOfDelivery).ToList();

            return slots;
        }

    }
}
