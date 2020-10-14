import { HttpSecureService } from '.';
import { Injectable } from '@angular/core';
import { Items } from './items.service';
import { BasketModel } from './basket.service';
import { AppConstants } from '../constants/app-constants';
import { Observable } from 'rxjs';
import { getLocaleExtraDayPeriods } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CheckOutService  extends  HttpSecureService<CheckoutModel>{
   
 public model :CheckoutModel = new CheckoutModel();
 public basket:BasketItemsToReceipt = new BasketItemsToReceipt();


 getMaxSlot(): Observable<MaxSlots[]>{
    return this.getAllAny(AppConstants.getApiPathByName("order","maxSlot"))
 } 
 getOrders():Observable<Orders[]>{
     return this.getAllAny(AppConstants.getApiPathByName("order","getOrders"))
 }
}

export class BasketItemsToReceipt{
    basketItems :BasketModel[];
}
export class CheckoutModel{
 firstName?:string;
 lastName?:string ;
 shippingAddress_postCode:string;
 shippingAddress_street:string;
 shippingAddress_country:string;
 shippingAddress_phoneNumber:string;

 billingAddress_postCode:string;
 billingAddress_street:string;
 billingAddress_country:string;
 billingAddress_phoneNumber:string;

 checkout1 :boolean;


 deliveryDate : Date;
 deliveryTime :string;
 checkout2 :boolean;
 checkout3:boolean;

 receiptNo?:number;
 deliveryPice?:number;

}
export class MaxSlots{
    deliveryDate :Date;
    maxNumber:number;
    maxNumberOfDelivery:number;
    slotName:string;
}
export class Orders{
    id:number;
    whenAdded:Date;
    buyerId:string;
    orderDetails:OrdersDetail[];
    numberOfItems:number;
    totalAmount:number;

}
export class OrdersDetail{
    id:number;
    whenAdded:Date;
    orderId:number;
    qty :number;
    discount:number;
    price:number;
    items:Items
}