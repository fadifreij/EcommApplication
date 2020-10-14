import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsService, Items } from 'src/app/services';
import { AppConstants } from 'src/app/constants/app-constants';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RoutingStateService } from 'src/app/services/routingState.service';
import { BasketService, BasketModel, Basket } from 'src/app/services/basket.service';
import { LoadingService } from 'src/app/services/loading-service';

@Component({
    selector: 'items-detail',
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.css']
  })
  export class    ItemDetailComponent implements OnInit {
    public item :Items
    public imagesRootPath = AppConstants.imagesRootPath;
    public imageMain :any;
    public mainMenu : string
    public submainMenu : string;
    public product : string 
    public buyerId =localStorage.getItem(AppConstants.cookieBasketItems)
    public isInWhishList = false;
    basketitems :BasketModel[] = [];
      constructor(private activatedRoute :ActivatedRoute ,
                  private iService :ItemsService,
                  private routingState: RoutingStateService,
                  private basketService:BasketService,
                  private loadingService:LoadingService){
                

      }
      ngOnInit(){
       
       


       this.activatedRoute.params.pipe(
         switchMap(params=>{
           let id = params['pId'];
           return this.loadItem(id)
         })
         
       ).subscribe(result=>{ this.item = result[0] ;
        this.imageMain = `${this.imagesRootPath}/${this.item.itemPicturePath}`
        
        let url =`${AppConstants.getApiPathByName('basket','getBasket')}`
        this.basketService.getById(url,this.buyerId)
       
        .subscribe(val=>{

          this.basketitems = val.basketItems;
         let p = this.basketitems.filter(x=>x.itemsId ===this.item.id && x.recentlyViewed==true)
         this.isInWhishList = p.length>0 
        
        })
        
      }
        ,err=>console.log(err))
       /* this.activatedRoute.params.subscribe(params => {
            let id = params['pId'];
           
          
            console.log(`${id}`);
            });*/


      //  this.activatedRoute.params.pipe()    
      }

      loadItem(pid:string):Observable<Items>{
        return  this.iService.getById(AppConstants.getApiPath(4,'getItemByPId') ,pid)
      }

     setMainImg(img :string){
       
       this.imageMain =`${this.imagesRootPath}/${img}`
     }
     addShoppingBasket(item:Items){
      
       this.basketService.addShoppingBasket(item)
     }
    /* addShoppingBasket1(item :Items){
     
      
       
        if(!!this.buyerId){
        
        let url =`${AppConstants.getApiPathByName('basket','getBasket')}`
        this.basketService.getById(url,this.buyerId)
       
        .subscribe(val=>{
          
          this.basketitems = val.basketItems;
          let inList = false;
         
          for(var i = 0 ;i < this.basketitems.length ; i ++){
            if(this.basketitems[i].itemsId === item.id){
              this.basketitems[i].qty = this.basketitems[i].qty + 1;
              this.basketitems[i].inBasket = true;
              this.basketitems[i].recentlyViewed = false;
              inList = true;
            }
          }
          if(inList == false) // if this item not in shopping basket we have to add it 
          {
            var basketModel : BasketModel = { 'basketId' : val.id , 'qty': 1,'itemsId':item.id, 'unitPrice':item.price,'discount':item.discount,'inBasket':true,'recentlyViewed':false }
            this.basketitems.push(basketModel)
          }
        
       var sumOfItems = 0
       this.basketitems.map(x=> sumOfItems+=x.qty)
      
    
           // insert the data to the server when it is not first time 
           var model :Basket = {'id':val.id ,'buyerId':this.buyerId, 'basketItems': this.basketitems}
           this.basketService.create(AppConstants.getApiPathByName('basket','addBasket'), model)
           .subscribe(result =>{ 
             localStorage.setItem(AppConstants.cookieBasketItems,""+result)
             this.loadingService.setBasketMessage(sumOfItems)
             console.log(result)} ,err=>console.log(err))
        })
        }//if this is the first time and buyerId not exists
        else{
          this.basketitems = [];
          var basketModel : BasketModel = { 'basketId' : 0 , 'qty': 1,'itemsId':item.id, 'unitPrice':item.price,'discount':item.discount,'inBasket':true,'recentlyViewed':false }
          this.basketitems.push(basketModel)
    
          // insert the data to the server when it is the first time 
          var model :Basket = {'id':0 ,'buyerId':this.buyerId, 'basketItems': this.basketitems}
          this.basketService.create(AppConstants.getApiPathByName('basket','addBasket'), model)
          .subscribe(result =>{ 
            localStorage.setItem(AppConstants.cookieBasketItems,""+result)
            this.loadingService.setBasketMessage(1)
            console.log(result)} ,err=>console.log(err))
    
        }
    
    
    
    }*/
    addwhishlist(item:Items){
            
      if(!!this.buyerId){
      
      let url =`${AppConstants.getApiPathByName('basket','getBasket')}`
      this.basketService.getById(url,this.buyerId)
     
      .subscribe(val=>{
        
        this.basketitems = val.basketItems;
        let inList = false;
       
        for(var i = 0 ;i < this.basketitems.length ; i ++){
          if(this.basketitems[i].itemsId === item.id){
             this.basketitems[i].recentlyViewed = !this.basketitems[i].recentlyViewed;
             this.isInWhishList =  this.basketitems[i].recentlyViewed
             inList = true;
          }
        }
        if(inList == false) // if this item not in shopping basket we have to add it 
        {
          var basketModel : BasketModel = { 'basketId' : val.id , 'qty': 0,'itemsId':item.id, 'unitPrice':item.price,'discount':item.discount,'inBasket':false,'recentlyViewed':true }
          this.isInWhishList = true;
          this.basketitems.push(basketModel)
        }
      
      /*  var sumOfItems = 0
        this.basketitems.map(x=> sumOfItems+=x.qty)*/
    
    
         // insert the data to the server when it is not first time 
         var model :Basket = {'id':val.id ,'buyerId':this.buyerId, 'basketItems': this.basketitems}
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
        var model :Basket = {'id':0 ,'buyerId':this.buyerId, 'basketItems': this.basketitems}
        this.basketService.create(AppConstants.getApiPathByName('basket','addBasket'), model)
        .subscribe(result =>{ 
          localStorage.setItem(AppConstants.cookieBasketItems,""+result)
         
          console.log(result)} ,err=>console.log(err))
    
      }
    
    
    }
  }