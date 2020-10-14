import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { take, map, switchMap } from 'rxjs/operators';
import { ItemsService, Items } from 'src/app/services';
import { AppConstants } from 'src/app/constants/app-constants';
import { BasketModel, BasketService, Basket } from 'src/app/services/basket.service';
import { LoadingService } from 'src/app/services/loading-service';
import { RoutingStateService } from 'src/app/services/routingState.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'items-page',
  templateUrl: './items-page.component.html',
  styleUrls: ['./items-page.component.css']
})
export class    ItemsPageComponent implements OnInit {
  public list :Items[]  =[];
  public originalList : Items[] = [];

  public mainMenuName :string;
  public subMainMenuName:string;
  public productName :string;

  //whishlist toggle item
  public isWhishList  = new Array().fill(false);

  //filter parameters 
  public searchCriteria ={'cat' :"" ,'brand' :"" , 'color':"" , 'size': ""}
  
  //right filters  parameters
  public classActive=0;
  public categoryCount = 0;
  public categories = [];
  public brands = [];
  public colors =[];
  public sizes = [];

  public sortBy = ""
  
  public imagesRootPath = AppConstants.imagesRootPath;
  item : Items;
  basketitems :BasketModel[] = [];
  whishListitems :BasketModel[] = [];
  // for pagination 
  public clsbutton9 ="btn btn-sm btn-primary";
  public clsbutton18  = "btn btn-outline-secondary btn-sm";
  public clsbuttonAll = "btn btn-outline-secondary btn-sm";
  

  public pageSize =9

  pageOfItems: Array<any>;

  public isLoading  = false;

  constructor( private router :Router,
               private route: ActivatedRoute,
               private iService:ItemsService,
               private basketService:BasketService,
            
           ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   //this.routingState.getPreviousUrl()
   }
   // for pagination
   onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
}
// end  

  ngOnInit(): void {
   this.searchCriteria ={'cat' :"" ,'brand' :"" , 'color':"" , 'size': ""}
    this.getData()
   
   
  //  (<any>window).x = "fadi"
   
   // console.log(history.state)
    // I passed productId in state and i put state in the router link but on refresh this become undefined
   // have to find other solution rely on url
/*
    this.route.params.subscribe(params=>{
      let mainMenuName = params.mainMenu;
      let subMainMenuName = params.subMainMenu;
      let productName = params.product

      this.iService.getAll(`${AppConstants.getApiPath(3,"getItems")}/${mainMenuName}/${subMainMenuName}/${productName}`)
    .subscribe(result => { this.list = result 
      
      console.log(this.list)
    } , err=>{ console.log(err)})
    })*/
   
  }
  display(numberofRows:number , cls:string){
    this.clsbutton9 = "btn btn-outline-secondary btn-sm"
    this.clsbutton18 = "btn btn-outline-secondary btn-sm"
    this.clsbuttonAll = "btn btn-outline-secondary btn-sm"

  if(cls == "1") 
   this.clsbutton9 = "btn btn-sm btn-primary"

   if (cls=="2") 
   this.clsbutton18 = "btn btn-sm btn-primary"

   if(cls=="3")
   this.clsbuttonAll = "btn btn-sm btn-primary"

    this.pageSize = numberofRows

    this.sortBy=""
      
  }
  displaySorted(){
   
    this.pageOfItems=this.pageOfItems.sort((a,b)=>{
        if(this.sortBy=="price")
           return  (a.price < b.price)?-1:1;
           else
           return (a.itemName <b.itemName)?-1:1;
      }  )
  }
  displayFiltered(){

    this.iService.getAll(`${AppConstants.getApiPath(3,"getItems")}/${this.mainMenuName}/${this.subMainMenuName}/${this.productName}`)
    .subscribe(result => { this.list = result 
      this.originalList=result}
    )
  }

  filterBy(type ,catId?:string){
   
    if(type ==="") // category all 
        {  this.searchCriteria ={'cat' :"" ,'brand' :"" , 'color':"" , 'size': ""}
          this.classActive =0;
        }
   
    if(type ==="cat")
       { this.searchCriteria.cat = catId
         this.classActive  = +catId
       }
    
    if(type==="brand")
          this.searchCriteria.brand = this.brands.filter(b=>b.checked ===true).map(b=>b.id).toString()
     
    
        
    if(type==="color")
      this.searchCriteria.color =this.colors.filter(b=>b.checked ===true).map(b=>b.id).toString()
      
    
    
    if(type==="size")
      this.searchCriteria.size = this.sizes.filter(b=>b.checked ===true).map(b=>b.id).toString()
     
    
    this.getData()
  }
  clear(type){
    if(type ==="cat")  this.searchCriteria.cat = ""
    else if(type=== "brand") this.searchCriteria.brand =""
    else if(type=== "color") this.searchCriteria.color =""
    else if (type ==="size") this.searchCriteria.size = ""

    this.getData();
    
  }
  
  getData(){
    this.mainMenuName = this.route.snapshot.params.mainMenu;
    this.subMainMenuName = this .route.snapshot.params.subMainMenu;
    this.productName = this.route.snapshot.params.product
    this.isLoading= true;
   // this.classActive = !this.classActive;  
    // let productId = history.state.productId;
   let url = `${AppConstants.getApiPath(3,"getItems")}/${this.mainMenuName}/${this.subMainMenuName}/${this.productName}`
  
   
   let criteria =[]
   if(this.searchCriteria.cat !==''){
   
     criteria.push(`CategoryId=${this.searchCriteria.cat}`)
   }
    if(this.searchCriteria.brand !==''){
     criteria.push(`BrandId=${this.searchCriteria.brand}`)
   }
    if(this.searchCriteria.color !==''){
    criteria.push(`ProductColorId=${this.searchCriteria.color}`)
   }
    if(this.searchCriteria.size  !== ''){
     criteria.push(`SizeId=${this.searchCriteria.size}`)
   }
  let str =(criteria.length===0)?"":`?${criteria.join("&")}` 

  // console.log(`${url}?${str}`)
   //this.iService.getAll(`${url}${str}`)
  this.loadwhishlist() // to find the whishlist when we display the items
   .pipe(switchMap(result =>{ 
    
    if(!!result.basketItems )
     this.whishListitems =result.basketItems.filter(x=>x.recentlyViewed ===true)
   
     
     return this.iService.getAll(`${url}${str}`)
     }))
   .subscribe(result => { 
    
     this.isLoading=false
     this.list = result 
    // this.originalList=result
    
     this.list.map(items => {
      
       if(this.whishListitems.find(x=>x.itemsId=== items.id) !== undefined)
        items.isWhishList = true;
        else
        items.isWhishList = false;
        return items;
     })
        this.originalList = this.list;
    
     if(this.searchCriteria.cat ==='')// this is called on load or on reset category
       this.categoryCount = this.originalList.map(l=>l.category.id).length
   //  this.categories = [... new Set(this.originalList.map(l=>l.category))];
   
  

    this.categories = this.originalList.map(l=>l.category.id)
    .filter((val,index,self)=>self.indexOf(val) ===index)
    .map(id =>{ return { id : id , 'categoryName':this.originalList.find(p=>p.category.id == id).category.categoryName ,'cnt': this.originalList.filter(p=>p.categoryId == id).length}

    });
    
    this.brands = this.originalList.map(b=>b.brand.id)
    .filter((val,index,self)=>self.indexOf(val)===index)
    .map(id=>({'id':id , 'brandName': this.originalList.find(p=>p.brand.id==id).brand.brandName ,'cnt':this.originalList.filter(p=>p.brandId == id).length ,'checked':(this.searchCriteria.brand !=='')?true:false}))
    //this.categories = Array(5).fill(`0`).map((val,index,self)=> self[index] =`cat ${index +1}`)
   


    this.colors = this.originalList.map(c=>c.productColor.id)
    .filter((val,index,self)=>self.indexOf(val)===index)
    .map(id=>({'id':id ,'colorName': this.originalList.find(c=>c.productColor.id==id).productColor.colorName , 'cnt' :this.originalList.filter(c=>c.productColorId ==id).length ,'checked':(this.searchCriteria.color !=='')?true:false}))
   

    this.sizes =  this.originalList.map(c=>c.size.id)
    .filter((val,index,self)=>self.indexOf(val)===index)
    .map(id=>({'id':id ,'sizeName': this.originalList.find(c=>c.size.id==id).size.sizeName , 'cnt' :this.originalList.filter(c=>c.sizeId ==id).length ,'checked':(this.searchCriteria.size  !== '')?true:false}))
    
   } , err=>{ this.router.navigate(['/'])})

    
  }
 
loadwhishlist():Observable<Basket>{
  let buyerId = localStorage.getItem(AppConstants.cookieBasketItems)
  if(!!buyerId){
  
    let url =`${AppConstants.getApiPathByName('basket','getBasket')}`
  return  this.basketService.getById(url,buyerId)
  .pipe(
  map(val=>{
 
    if(!val)
    return Observable.create((observer:any)=>{ observer.next([]);observer.complete()})
    else
    return val;

  }))
  }
 
  return  Observable.create((observer :any)=>{
    observer.next([]);
    observer.complete();
  });
}
addShoppingBasket(item:Items){

  this.basketService.addShoppingBasket(item)
}

addwhishlist(item:Items){
  this.basketService.addwhishlist(item);
}

updatetowhishList(list: any[] , id:number ,val:any){
// console.log(list)
 //console.log(id)
  let index  = list.findIndex(x=>x.id ===id)
 // console.log(index)
  list[index].isWhishList = val;
}
  activateClass(classActive){
    classActive = !classActive;    
  }
  doChange(obj){
        obj.checked = !obj.checked
    }
}
