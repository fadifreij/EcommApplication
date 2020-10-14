import { OnInit, Component } from '@angular/core';
import { CheckOutService } from 'src/app/services/checkOut.service';
import { BasketService, BasketModel } from 'src/app/services/basket.service';
import { AppConstants, ErrorParse } from 'src/app/constants/app-constants';
import { Router } from '@angular/router';
import { ParseError } from '@angular/compiler';


@Component({
    selector: 'checkout3',
    templateUrl: './checkout3.component.html',
   
  })
  export class CheckOut3Component implements OnInit {
    public DeliveryDate:Date;
    public DeliveryTime :string;
    
    public FullName :string;

   public shippingAddress_postCode :string = ""
   public shippingAddress_street :string = ""
   public shippingAddress_country :string = ""
   public shippingAddress_phoneNumber:string =""

   public billingAddress_postCode :string =""
   public billingAddress_street :string = ""
   public billingAddress_country:string =""
   public billingAddress_phoneNumber:string=""

   public shippingCost = 0
   public totalAmount = 0 ;
   public error : string;

   public isworking :boolean = false;

   public items:BasketModel[];
   public card :any ={}
    constructor(private checkoutService:CheckOutService,
                private basketService :BasketService,
                private router :Router){}
    ngOnInit(): void {
 
      // redirect to checkout2 if model is null
      if(!this.checkoutService.model.checkout2)
        this.router.navigate(['/Checkout-1'])
        
      this.shippingCost = this.basketService.shippingCost;
      this.DeliveryDate=this.checkoutService.model.deliveryDate;
      this.DeliveryTime= this.checkoutService.model.deliveryTime;

      this.FullName = `${this.checkoutService.model.firstName} ${this.checkoutService.model.lastName}`;
      
      this.shippingAddress_postCode = this.checkoutService.model.shippingAddress_postCode;
      this.shippingAddress_street = this.checkoutService.model.shippingAddress_street;
      this.shippingAddress_country=this.checkoutService.model.shippingAddress_country;
      this.shippingAddress_phoneNumber = this.checkoutService.model.shippingAddress_phoneNumber;
   
      this.billingAddress_postCode = this.checkoutService.model.billingAddress_postCode;
      this.billingAddress_street = this.checkoutService.model.billingAddress_street;
      this.billingAddress_country=this.checkoutService.model.billingAddress_country;
      this.billingAddress_phoneNumber = this.checkoutService.model.billingAddress_phoneNumber;

      this.basketService.loadshoppingBasket()
     .subscribe(val=>this.getTotal(val),err=>this.getErrors(err))
    }
    getTotal(val){
      
        this.totalAmount = 0 ;
    
      
       this.items = val.basketItems  
       let basketitems = val.basketItems.filter(x=>x.qty!==0)
       basketitems.map(v =>{ 
                                   
         this.totalAmount += v.qty*v.unitPrice  - v.qty*v.unitPrice*v.discount/100})
      }
      getErrors(err){
       this.error=err
      }


      checkOut(){
        this.isworking = true;
       
       let orderId = localStorage.getItem(AppConstants.cookieBasketItems)
       let orderBillingAddress ={'postCode':this.billingAddress_postCode,'street':this.billingAddress_street,'country':this.billingAddress_country,'telephone':this.billingAddress_phoneNumber}
       let orderShippingAddress={'postCode':this.shippingAddress_postCode,'street':this.shippingAddress_street,'country':this.shippingAddress_country,'telephone':this.shippingAddress_phoneNumber}
       let card={'cardNumber':this.card.card_number,'expiryMonth':this.card.month,'expiryYear':this.card.year,'cVV':this.card.CVV}
       let slotDelivery={'deliveryDate':this.DeliveryDate.toDateString(),'slotName':this.DeliveryTime,'maxNumberOfDelivery':2,'slotPrice':AppConstants.deliveryPrice}
       let model ={'orderId' :orderId ,
                    'firstName':this.checkoutService.model.firstName,
                    'lastName':this.checkoutService.model.lastName,
                   
                    'orderBillingAddress':orderBillingAddress,
                    'orderShippingAddress':orderShippingAddress,

                   'slotDelivery':slotDelivery,

                    'card':card
                }
           
         this.checkoutService.basket.basketItems = this.items
         console.log(this.items)
         this.checkoutService.createAny(AppConstants.getApiPathByName("order","checkout"),model)
         .subscribe(result=>{
          this.checkoutService.model.receiptNo = result;
          this.checkoutService.model.deliveryPice = this.shippingCost;
          this.checkoutService.model.checkout3=true;
          
          this.router.navigate(['./Checkout-4'])
         },
          err=>{
           
            this.isworking=false;
            this.error = err.error.message
            if(err.error.source==="BusinessLayer"){
            let itemName = this.items.find(x=>x.itemsId == err.error.itemId)
           
              this.error= `Maximum number of item/s of <br/>  <strong> ${itemName.items.itemName}</strong> is: <br/> <strong>${err.error.qty}</strong> `
            }
           
          },()=>this.isworking=false
         )
        
      }

      getError(err){
        this.isworking=false
       // this.error = ErrorParse(err)
        console.log(this.error)
      }
  }