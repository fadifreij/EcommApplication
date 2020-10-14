import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpService, Items } from '.';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../constants/app-constants';
import { LoadingService } from './loading-service';


@Injectable({ providedIn: 'root' })
export class BasketService  extends  HttpService<Basket>{
   
    public shippingCost = AppConstants.deliveryPrice;
    basketitems :BasketModel[] = [];
   
   constructor(public httpClient : HttpClient,private loadingService:LoadingService){
       super(httpClient)
   }

 
 addShoppingBasket(item :Items){
     
    let  buyerId =localStorage.getItem(AppConstants.cookieBasketItems)
       
    if(!!buyerId){
    
    let url =`${AppConstants.getApiPathByName('basket','getBasket')}`
    this.getById(url,buyerId)
   
    .subscribe(val=>{
      
     if(!!val)
      this.basketitems = val.basketItems;
      else
      this.basketitems=[];
      let inList = false;
     
      for(var i = 0 ;i < this.basketitems.length ; i ++){
        if(this.basketitems[i].itemsId === item.id){
          this.basketitems[i].qty = this.basketitems[i].qty + 1;
          this.basketitems[i].inBasket = true;
          this.basketitems[i].recentlyViewed = this.basketitems[i].recentlyViewed;
          inList = true;
        }
      }
      if(inList == false) // if this item not in shopping basket we have to add it 
      {
       let id=((!!val)?val.id:0)
        var basketModel : BasketModel = { 'basketId' : id , 'qty': 1,'itemsId':item.id, 'unitPrice':item.price,'discount':item.discount,'inBasket':true,'recentlyViewed':false }
        this.basketitems.push(basketModel)
      }
    
   var sumOfItems = 0
   this.basketitems.map(x=> sumOfItems+=x.qty)
  

       // insert the data to the server when it is not first time 
       let id =((!!val)?val.id:0)
       var model :Basket = {'id':id ,'buyerId':buyerId, 'basketItems': this.basketitems}
       this.create(AppConstants.getApiPathByName('basket','addBasket'), model)
       .subscribe(result =>{ 
         localStorage.setItem(AppConstants.cookieBasketItems,""+result)
         this.loadingService.setBasketMessage(sumOfItems)
        } ,err=>console.log(err))
    })
    }//if this is the first time and buyerId not exists
    else{
      this.basketitems = [];
      var basketModel : BasketModel = { 'basketId' : 0 , 'qty': 1,'itemsId':item.id, 'unitPrice':item.price,'discount':item.discount,'inBasket':true,'recentlyViewed':false }
      this.basketitems.push(basketModel)

      // insert the data to the server when it is the first time 
      var model :Basket = {'id':0 ,'buyerId':buyerId, 'basketItems': this.basketitems}
      this.create(AppConstants.getApiPathByName('basket','addBasket'), model)
      .subscribe(result =>{ 
        localStorage.setItem(AppConstants.cookieBasketItems,""+result)
        this.loadingService.setBasketMessage(1)
        } ,err=>console.log(err))

    }



}
     addwhishlist(item:Items){
  let buyerId = localStorage.getItem(AppConstants.cookieBasketItems)
   
  if(!!buyerId){
  
  let url =`${AppConstants.getApiPathByName('basket','getBasket')}`
  this.getById(url,buyerId)
 
  .subscribe(val=>{
    if(!!val)
    this.basketitems = val.basketItems;
    else
    this.basketitems=[];
    let inList = false;
   
    for(var i = 0 ;i < this.basketitems.length ; i ++){
      if(this.basketitems[i].itemsId === item.id){
         this.basketitems[i].recentlyViewed = !this.basketitems[i].recentlyViewed;
        item.isWhishList= this.basketitems[i].recentlyViewed 
        inList = true;
      }
    }
    if(inList == false) // if this item not in shopping basket we have to add it 
    {
      let id = ((!!val)?val.id:0)
      var basketModel : BasketModel = { 'basketId' : id , 'qty': 0,'itemsId':item.id, 'unitPrice':item.price,'discount':item.discount,'inBasket':false,'recentlyViewed':true }
      item.isWhishList = true
      this.basketitems.push(basketModel)
    }
  
  /*  var sumOfItems = 0
    this.basketitems.map(x=> sumOfItems+=x.qty)*/


     // insert the data to the server when it is not first time 
    let id=((!!val)?val.id:0)
     var model :Basket = {'id':id ,'buyerId':buyerId, 'basketItems': this.basketitems}
     this.create(AppConstants.getApiPathByName('basket','addBasket'), model)
     .subscribe(result =>{ 
       localStorage.setItem(AppConstants.cookieBasketItems,""+result)
        } ,err=>console.log(err))
  })
  }//if this is the first time and buyerId not exists
  else{
    this.basketitems = [];
    var basketModel : BasketModel = { 'basketId' : 0 , 'qty': 0,'itemsId':item.id, 'unitPrice':item.price,'discount':item.discount,'inBasket':false,'recentlyViewed':true }
    item.isWhishList = true;
    this.basketitems.push(basketModel)

    // insert the data to the server when it is the first time 
    var model :Basket = {'id':0 ,'buyerId':buyerId, 'basketItems': this.basketitems}

    this.create(AppConstants.getApiPathByName('basket','addBasket'), model)
    .subscribe(result =>{ 
      localStorage.setItem(AppConstants.cookieBasketItems,""+result)
     
      console.log(result)} ,err=>console.log(err))

  }


}
loadshoppingBasket():Observable<Basket>{
 
  let buyerId = localStorage.getItem(AppConstants.cookieBasketItems)
  let url =`${AppConstants.getApiPathByName('basket','getBasket')}`
   return this.getById(url,buyerId)
 }

}
export class Basket {
    id:number;
    buyerId:string;
    basketItems : BasketModel[];
}
export class BasketModel{
   
    id?:number;
    basketId :number;
    qty :number;
    unitPrice:number;
    discount:number;
    itemsId:number;
    recentlyViewed:boolean;
    inBasket:boolean;
    items?:Items
}