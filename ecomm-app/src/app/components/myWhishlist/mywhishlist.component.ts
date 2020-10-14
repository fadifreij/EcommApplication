import { OnInit, Component } from '@angular/core';
import { AppConstants } from 'src/app/constants/app-constants';
import { BasketService, BasketModel, Basket } from 'src/app/services/basket.service';
import { Items } from 'src/app/services';

@Component({
    selector: 'mywhishlist',
    templateUrl: './mywhishlist.component.html',
    styleUrls: ['./mywhishlist.component.css']
  })
  export class    MyWhishListComponent implements OnInit {
    public whishlistitems :BasketModel[]
    public imagesRootPath = AppConstants.imagesRootPath;
    public buyerId = localStorage.getItem(AppConstants.cookieBasketItems)
    public basketitem  :BasketModel;
    public basketitems :BasketModel[];
constructor(  private basketService : BasketService){
  
}
    ngOnInit(): void {
     
      let url =`${AppConstants.getApiPathByName('basket','getBasket')}`
      this.basketService.getById(url,this.buyerId)
       .subscribe(val=>{
        this.whishlistitems = val.basketItems.filter(x=>x.recentlyViewed==true)
       
       })
    }

    addwhishlist(id:number){
            
      if(!!this.buyerId){
      
      let url =`${AppConstants.getApiPathByName('basket','getBasket')}`
      this.basketService.getById(url,this.buyerId)
     
      .subscribe(val=>{
        
        this.basketitem = val.basketItems.filter(x=>x.id === id)[0];
      
        
          this.basketitems = [];
          var basketModel : BasketModel = {'id': this.basketitem.id, 'basketId' : val.id , 'qty': this.basketitem.qty,'itemsId':this.basketitem.itemsId, 'unitPrice':this.basketitem.unitPrice,'discount':this.basketitem.discount,'inBasket':this.basketitem.inBasket,'recentlyViewed':false }
          this.basketitems.push(basketModel)
          var model :Basket = {'id':val.id ,'buyerId':this.buyerId, 'basketItems': this.basketitems}
          this.basketService.create(AppConstants.getApiPathByName('basket','addBasket'),model)
          .subscribe(result =>{ 
            localStorage.setItem(AppConstants.cookieBasketItems,""+result)
            window.location.reload()
             } ,err=>console.log(err))
        })
      
     
    
       
     
     
      
    
    
    }
}

addShoppingBasket(item:Items){
      
  this.basketService.addShoppingBasket(item)
}

  }