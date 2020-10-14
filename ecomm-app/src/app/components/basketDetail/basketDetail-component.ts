import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RoutingStateService } from 'src/app/services/routingState.service';
import { BasketService, BasketModel, Basket } from 'src/app/services/basket.service';
import { AppConstants, ErrorParse } from 'src/app/constants/app-constants';
import { map, filter, pairwise } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading-service';

import { Router, RoutesRecognized} from '@angular/router';
import { UsersService } from 'src/app/services';
import { Observable } from 'rxjs';
import { CheckOutService, CheckoutModel } from 'src/app/services/checkOut.service';

@Component({
  selector: 'basket-detail',
  templateUrl: './basketDetail.component.html',
 // styleUrls: ['./basketDetail.component.css']
})
export class BasketDetailComponent implements OnInit  {
  public previousRoute: string;
  public basketitems : BasketModel[];
  public imagesRootPath = AppConstants.imagesRootPath;
  public basketId : number;
  error : {'errCode': number , 'errList' : any[]};
  public totalItemsNumber :number = 0 ;
  public totalAmount :number = 0;
  public shippingCost = 0

  
  constructor(
              private basketService : BasketService,
              private loadingService:LoadingService,
              private userService :UsersService,
              private route : Router,
              private checkoutService : CheckOutService
               ) { }
    
  ngOnInit(): void {
   
    this.shippingCost=this.basketService.shippingCost;
  /*   if(this.routingState.getPreviousUrl()=== this.routingState.getCurrentUrl()){
             this.previousRoute = '/'
       }
      else{
      
         this.previousRoute = this.routingState.getPreviousUrl();
       }
      */
      this.basketService.loadshoppingBasket()
          .subscribe(val=>this.getTotals(val),err=>this.getErrors(err))
      ;
  }
  getShippingValue(){
    return AppConstants.deliveryPrice;
  }
  gotoShopping():void{
    
 // this.previousRoute$.subscribe(url=>console.log(url))
    window.history.back();
   
    // i used deodeURIComponent because the url may contain space %25 
  //  this.route.navigate([decodeURIComponent(this.previousRoute)])
  }
 
  calculateNewTotal(){
    this.totalAmount = 0 ;
    this.basketitems.map(v=>this.totalAmount+= v.qty*v.unitPrice - v.qty*v.unitPrice*v.discount/100)
  }
/* loadshoppingBasket(){
    this.totalItemsNumber = 0 ;
    this.totalAmount = 0 ;
    let buyerId = localStorage.getItem(AppConstants.cookieBasketItems)
    let url =`${AppConstants.getApiPathByName('basket','getBasket')}`
    this.basketService.getById(url,buyerId)
     .subscribe(val=>{
      this.basketId = val.id
     
      this.basketitems = val.basketItems.filter(x=>x.qty!==0)
      this.basketitems.map(v =>{ this.totalItemsNumber += v.qty 
                                 
       this.totalAmount += v.qty*v.unitPrice  - v.qty*v.unitPrice*v.discount/100})
       this.loadingService.setBasketMessage(this.totalItemsNumber);
    },err=>this.error = ErrorParse(err))
  }
  */
  getTotals(val){
  
  this.totalItemsNumber = 0 ;
  this.totalAmount = 0 ;
 
    if(val==null){
      localStorage.removeItem(AppConstants.cookieBasketItems);
      this.loadingService.setBasketMessage(0);
      this.basketitems= [];
     return;
    }
   

    this.basketId = val.id
     
    this.basketitems = val.basketItems.filter(x=>x.qty!==0)
    this.basketitems.map(v =>{ this.totalItemsNumber += v.qty 
                               
     this.totalAmount += v.qty*v.unitPrice  - v.qty*v.unitPrice*v.discount/100})
   
      this.loadingService.setBasketMessage(this.totalItemsNumber);
  }
 
  getErrors(err){
    this.error=ErrorParse(err)
  }




   deleteBasket(id:number){
     this.basketService.deleteById(AppConstants.getApiPathByName("basket","deleteBasket"),id)
     .subscribe(val=>{

        this.basketService.loadshoppingBasket()
         .subscribe(val=>this.getTotals(val),err=>this.getErrors(err));
         },err=>this.error = ErrorParse(err))
  
   }
   updateBasket(){
    let buyerId = localStorage.getItem(AppConstants.cookieBasketItems)
    var model :Basket = {'id':this.basketId ,'buyerId':buyerId, 'basketItems': this.basketitems}
    this.basketService.create(AppConstants.getApiPathByName('basket','addBasket'), model)
    .subscribe(result =>{
     let updatedQty = 0
      this.basketitems.map(x=>updatedQty += x.qty)
      this.loadingService.setBasketMessage(updatedQty)
    //  this.gotoShopping();
    })
   
   }
   proceedCheckout(){
    this.updateBasket()
    this.checkoutService.model = new CheckoutModel();
    this.userService.isAuthenticated.subscribe(val=>{
      if(val == true){
     
      this.route.navigate(['./Checkout-1'])
      }
      else{
        this.route.navigate(['./Register'],{ queryParams: { redirectUrl: 'Checkout-1' } })
      }
    })
   
   }
}
