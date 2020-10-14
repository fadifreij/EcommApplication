import { OnInit, Component } from '@angular/core';
import { CheckOutService } from 'src/app/services/checkOut.service';
import { Items } from 'src/app/services';
import { LoadingService } from 'src/app/services/loading-service';
import { BasketModel } from 'src/app/services/basket.service';
import { Router } from '@angular/router';

@Component({
    selector: 'checkout4',
    templateUrl: './checkout4.component.html',
    styleUrls:['./checkout4.component.css']
  })
  export class CheckOut4Component implements OnInit {
    public receiptNo:number;
    public postCode :string;
    public street :string;
    public country :string;
    public phoneNumber :string;

    public deliveryDate :Date = new Date();
    public deliveryPrice=0;

    public SelectedItems:BasketModel[]

    public priceBeforeDiscount =0;
    public priceAfterDiscount =0;
    constructor(private checkoutService:CheckOutService,
                private loadingService :LoadingService,
                private router:Router){}
    ngOnInit(): void {
     if(!this.checkoutService.model.checkout3)
     {
       this.router.navigate(['./'])
     }

     this.receiptNo= this.checkoutService.model.receiptNo
     this.postCode = this.checkoutService.model.shippingAddress_postCode;
     this.street = this.checkoutService.model.shippingAddress_street;
     this.country = this.checkoutService.model.shippingAddress_country;
     this.phoneNumber = this.checkoutService.model.shippingAddress_phoneNumber;

     //this.deliveryDate = this.checkoutService.model.deliveryDate;
     this.deliveryPrice = this.checkoutService.model.deliveryPice;
    
    
     this.SelectedItems = this.checkoutService.basket.basketItems;
    // (<any>window).items = this.SelectedItems
     this.SelectedItems?.map(x=>{
       this.priceBeforeDiscount += x.items.price;
       this.priceAfterDiscount+= x.items.price - x.discount*x.items.price/100;

     })
   
     
     this.loadingService.setBasketMessage(0);
     
    
      
    }
      
  }