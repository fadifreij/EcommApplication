import { OnInit, Component } from '@angular/core';
import { CheckOutService, MaxSlots } from 'src/app/services/checkOut.service';
import { BasketService } from 'src/app/services/basket.service';
import { Router } from '@angular/router';

@Component({
    selector: 'checkout2',
    templateUrl: './checkout2.component.html',
   
  })
  export class CheckOut2Component implements OnInit {
    public totalAmount = 0 ; 
    public error : {'errCode': string , 'errList' : []};

    public numberofDays = 14;
    public startingDate = new Date();
  
    public listofDate = [];
    public listoftimes=['9am-12am','12am-3pm','3pm-6pm','6pm-9pm']
    public shippingCost = 0
    public disableCheckout3 = true;
    public maxSlotList : MaxSlots[]
    constructor(private checkoutService:CheckOutService,
                private basketService:BasketService,
                private router:Router){}
    ngOnInit(): void {

//REDIRECT TO CHECKOUT1 IF THE MODEL CHECKOUT1 IS FALSE
if(!this.checkoutService.model.checkout1){
   this.router.navigate(['/Checkout-1'])
}
this.shippingCost = this.basketService.shippingCost;
this.disableCheckout3 = !this.checkoutService.model.checkout2;

//GET ALL MAX SLOT TO DISABLE THE CHECKBOX 
this.checkoutService.getMaxSlot()
.subscribe(s=>{this.maxSlotList=s


   for(var i=1;i<=this.numberofDays;i++){
      this.listofDate.push(this.AddDate(i))
   }
},err=>this.error=err)

    
    
    
     
    
     this.basketService.loadshoppingBasket()
     .subscribe(val=>this.getTotal(val),err=>this.getErrors(err))
    }
  disableDateTime(dte:Date,time):boolean {
  
        var elem =  this.maxSlotList.find(x=> this.isDateEqual(new Date(x.deliveryDate) , dte) && x.slotName===time)   
           return (!!elem)
 
  }  
    getDateTime(dte , time){
     
      this.checkoutService.model = {...this.checkoutService.model, deliveryDate:dte, deliveryTime:time ,checkout2:true}
      
    
       /* this.checkoutService.model.deliveryDate = dte;
        this.checkoutService.model.deliveryTime = time;*/

        this.disableCheckout3 = false;
        this.isChecked(dte,time)
      
    }
    AddDate(numberofdays :number){
        return new Date(this.startingDate.getUTCFullYear() ,this.startingDate.getMonth()  ,this.startingDate.getDate() +numberofdays)
    }
    isChecked(dte,time){
     
       if(this.checkoutService.model.checkout2)     
       return this.isDateEqual(dte,this.checkoutService.model.deliveryDate) && time===this.checkoutService.model.deliveryTime;
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
      const {deliveryDate,deliveryTime} = this.checkoutService.model;
    //  console.log(deliveryDate,deliveryTime)
   //  this.isChecked(deliveryDate,deliveryDate)
    }
    isDateEqual(dte1:Date,dte2:Date)
    {
    
      return dte1.getDate() ===dte2.getDate()&&dte1.getMonth()===dte2.getMonth()&&dte1.getUTCFullYear()===dte2.getUTCFullYear()
    }
  }