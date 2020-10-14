import { Component, OnInit } from '@angular/core';
import { of, Observable } from 'rxjs';
import { mergeMap, map, switchMap } from 'rxjs/operators';
import { CheckOutService, Orders, OrdersDetail } from 'src/app/services/checkOut.service';
import { AppConstants } from 'src/app/constants/app-constants';

@Component({
    selector: 'my-orders',
    templateUrl: './myOrders.component.html',
    styleUrls:['./myOrders.component.css']
  })
  export class MyOrdersComponent implements OnInit {
   public list:Orders[];
   public imagesRootPath = AppConstants.imagesRootPath;
   panelOpenState = false;
   
    constructor(private checkoutService:CheckOutService){

    }
  
    ngOnInit(): void {
    this.checkoutService.getOrders().subscribe(result=>this.getResult(result),err=>console.log(err))
    }


    getResult(result:Orders[]){
      
      this.list =[];
      
        result.map(x=>{
            let sumOfQty=0;
            let totalAmount =0;
 
            x.orderDetails.map(y=>{
                sumOfQty+=y.qty;
                totalAmount+=y.items.price -y.discount*y.items.price/100;
            })
           
            this.list.push({ id: x.id , buyerId:x.buyerId,whenAdded:x.whenAdded ,orderDetails:x.orderDetails,numberOfItems:sumOfQty,totalAmount:totalAmount });
            
        })
        
    }

    getSum(list:OrdersDetail[] ,sumOfQty:number ,totalAmount:number){
     
        list.map(x=>{
          //  console.log(x)
          //  console.log(x.items.qty)
            sumOfQty+= x.qty;
            totalAmount+=x.items.price;
        })
      sumOfQty= 12;

       // console.log(sumOfQty)
    }
  }