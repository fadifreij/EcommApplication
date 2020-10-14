import { Component, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/constants/app-constants';
import { ItemsService, Items } from 'src/app/services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { BasketService, BasketModel, Basket } from 'src/app/services/basket.service';
import { Observable, from } from 'rxjs';
import { ObserversModule } from '@angular/cdk/observers';

@Component({
    selector: 'search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.css']
  })
  export class    SearchPageComponent implements OnInit {
    public listitems : Items[]=[]
    public imagesRootPath = AppConstants.imagesRootPath;
    public buyerId = localStorage.getItem(AppConstants.cookieBasketItems)
    public basketitem  :BasketModel;
    public basketitems :BasketModel[];
    public criteria :string ="";
   constructor(private iService:ItemsService, 
               private basketService :BasketService,
               private activatedRoute :ActivatedRoute){

   }
    ngOnInit(){
     
       this.activatedRoute.paramMap.pipe(

           switchMap((params:ParamMap)=>{
          this.criteria = params.get('criteria')
            return  this.iService.getAll(`${AppConstants.getApiPath(4,"getLike")}/${params.get('criteria')}`)
           })
       ).subscribe(result=>{
      this.loadwhishlist().subscribe(list=>{
       let whishlist = list.basketItems.filter(x=>x.recentlyViewed===true)
       if(whishlist.length===0)
       result = result.map(p=>{return {...p,isWhishList:false}})
else{
    result = result.map(p=>{
      
        if(whishlist.filter(x=>x.itemsId===p.id).length ==0)
        return {...p,isWhishList:false}
        else
        return {...p,isWhishList:true}
    })
}
       
      //  result = result.map(p=>{return {...p,isWhishlist:false}})
        this.listitems=result
      

      })     
      
   })

       
       
    }

    loadwhishlist():Observable<Basket>{
        let buyerId = localStorage.getItem(AppConstants.cookieBasketItems)
        if(!!buyerId){
        
          let url =`${AppConstants.getApiPathByName('basket','getBasket')}`
        return  this.basketService.getById(url,buyerId)
        }
       
        return  Observable.create((observer :any)=>{
          observer.next([]);
          observer.complete();
        });
      } 

      addwhishlist1(item:Items){
        let buyerId = localStorage.getItem(AppConstants.cookieBasketItems)
         
        if(!!buyerId){
        
        let url =`${AppConstants.getApiPathByName('basket','getBasket')}`
        this.basketService.getById(url,buyerId)
       
        .subscribe(val=>{
          
          this.basketitems = val.basketItems;
          let inList = false;
         
          for(var i = 0 ;i < this.basketitems.length ; i ++){
            if(this.basketitems[i].itemsId === item.id){
               this.basketitems[i].recentlyViewed = !this.basketitems[i].recentlyViewed;
              
              inList = true;
            }
          }
          if(inList == false) // if this item not in shopping basket we have to add it 
          {
            var basketModel : BasketModel = { 'basketId' : val.id , 'qty': 0,'itemsId':item.id, 'unitPrice':item.price,'discount':item.discount,'inBasket':false,'recentlyViewed':true }
          
            this.basketitems.push(basketModel)
          }
        
        /*  var sumOfItems = 0
          this.basketitems.map(x=> sumOfItems+=x.qty)*/
      
      
           // insert the data to the server when it is not first time 
           var model :Basket = {'id':val.id ,'buyerId':buyerId, 'basketItems': this.basketitems}
           this.basketService.create(AppConstants.getApiPathByName('basket','addBasket'), model)
           .subscribe(result =>{ 
             localStorage.setItem(AppConstants.cookieBasketItems,""+result)
              } ,err=>console.log(err))
        })
        }//if this is the first time and buyerId not exists
        else{
          this.basketitems = [];
          var basketModel : BasketModel = { 'basketId' : 0 , 'qty': 0,'itemsId':item.id, 'unitPrice':item.price,'discount':item.discount,'inBasket':false,'recentlyViewed':true }
          this.basketitems.push(basketModel)
      
          // insert the data to the server when it is the first time 
          var model :Basket = {'id':0 ,'buyerId':buyerId, 'basketItems': this.basketitems}
          this.basketService.create(AppConstants.getApiPathByName('basket','addBasket'), model)
          .subscribe(result =>{ 
            localStorage.setItem(AppConstants.cookieBasketItems,""+result)
           
            console.log(result)} ,err=>console.log(err))
      
        }
      
      
      }
addwhishlist(item:Items){
    this.basketService.addwhishlist(item)
   
}
  addShoppingBasket(item:Items){
      
    this.basketService.addShoppingBasket(item)
  }
  }