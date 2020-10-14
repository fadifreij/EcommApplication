import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services';
import { AppConstants } from 'src/app/constants/app-constants';
import { BasketService } from 'src/app/services/basket.service';
import { Router } from '@angular/router';
import { CheckOutService } from 'src/app/services/checkOut.service';

@Component({
    selector: 'checkout1',
    templateUrl: './checkout1.component.html',
   
  })
  export class CheckOut1Component implements OnInit {
   public totalAmount = 0 ; 
   public  firstName=""
   public  lastName=""

   
   public submitted = false;
   public model :any = {}

   public error : {'errCode': string , 'errList' : []};

   public shippingAddress_postCode :string = ""
   public shippingAddress_street :string = ""
   public shippingAddress_country :string = ""
   public shippingAddress_phoneNumber:string =""

   public billingAddress_postCode :string =""
   public billingAddress_street :string = ""
   public billingAddress_country:string =""
   public billingAddress_phoneNumber:string=""
   public shippingCost = 0
   
     constructor(private userService:UsersService , 
                private basketService :BasketService,
                private checkoutService :CheckOutService,
                private router:Router){
             
                }
    ngOnInit(){
       this.shippingCost = this.basketService.shippingCost;

       if(this.checkoutService.model.checkout1) this.filldataBack();
       this.userService.getAll(AppConstants.getApiPathByName("account","getName"))
       .subscribe((result:any)=>{
        
         this.firstName=result.firstName;
         this.lastName=result.lastName;
         this.basketService.loadshoppingBasket()
         .subscribe(val=>this.getTotal(val),err=>this.getErrors(err))
        // this.totalAmount = this.basketService.TotalAmount;
       })

    }
    onSubmit(f){
     
      if(f.form.valid )
      {
       
       if(this.firstName==null && this.lastName==null)
       {
         this.firstName = this.model.firstName;
         this.lastName = this.model.lastName;
       }
        this.checkoutService.model={...this.model ,'checkout1':true,...this.checkoutService.model ,'firstName':this.firstName,'lastName':this.lastName}
       
        //move to next page
         this.router.navigate(['/Checkout-2'])

       
      }
      else{
        this.submitted = true;
      }
     
    }
    getTotal(val){
      
      this.totalAmount = 0 ;
  
    
       
     let basketitems = val.basketItems.filter(x=>x.qty!==0)
     basketitems.map(v =>{ 
                                 
       this.totalAmount += v.qty*v.unitPrice  - v.qty*v.unitPrice*v.discount/100})
    }
    getErrors(err){
     this.error=err
    }
    filldataBack(){
      this.model = this.checkoutService.model;
    }
  }