import { Component, OnInit, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import {UsersService, User, mainmenu, MainmenuService, ItemsService} from './../../services'
import { AppConstants } from 'src/app/constants/app-constants';
import {Router} from "@angular/router"
import { NgForm } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading-service';
import { BasketService } from 'src/app/services/basket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit ,AfterViewInit  {
   username:string ="";
   role :string = "";
   loginModel :any ={};
   isLogin :boolean =false;
   errMsgLogin =""
   cartLabel ="";
   list =[];
   search = "";
   clicked = false;
   l ;
   
   //for navbar to stick on mouse scroll down
  
   sticky: boolean = false;
    

   @ViewChild('closeModal') closeModal :ElementRef;
   @ViewChild('logout') logout : ElementRef; // we have to use this in reset page to click the logout
  constructor(private usersService:UsersService,
              private mService:MainmenuService, 
              private iService :ItemsService,
              private router: Router, 
              private loadingService:LoadingService,
              private basketService : BasketService) { }


  ngOnInit(): void {
    this.usersService.userInfo.subscribe(
      info =>{
        this.username = info.username;
        this.role = info.role;
      })
     this.loadingService.basket.subscribe(basketInfo=>this.cartLabel =(basketInfo==0)?`Cart is empty`:`${basketInfo} items in cart`) 
    
     this.loadmainMenu()
   
  }
  ngAfterViewInit(){
    
   
    //console.log(this.menuElement.nativeElement.offset)
   // console.log(this.elementPosition)
  }
  onShowPopup(f:NgForm){
    f.resetForm();
    this.errMsgLogin =""
  }
  onLoginSubmit(f:NgForm){
    let user:User = { username:"" , password: this.loginModel.password ,email:this.loginModel.email }
    this.isLogin=true;
    
    this.usersService.create(AppConstants.getApiPathByName("account","login"),user)
    .subscribe(
      response=>{
        this.usersService.setCookie(response.accessToken,response.refreshToken)
        f.resetForm();
        this.isLogin=false;
        window.location.href = './';
        //this.router.navigate(['/'])
        this.closeModal.nativeElement.click();
      },
      err=>{
        console.log(err)
        
        this.errMsgLogin = err.error;
        this.isLogin=false;
      }
    )
   
  }
  logOut():void{
   /* let user :User = {"username":"",email:"","password":"",  "refreshToken":this.usersService.getRefreshToken()}
    console.log(user);*/
   this.usersService.logOut(AppConstants.getApiPathByName("account","logout"),this.usersService.getRefreshToken())
    .subscribe(response=>{
           
        //  this.router.navigate(["/"])
          window.location.href="./"
     },err=>{
       console.log(err)
     })
  }
  loadmainMenu(){
     this.loadingService.sendMessage(false)
    
     this.mService.getAll(AppConstants.getApiPath(2,'getActive'))
     .subscribe(result =>{
     this.list = result;
  
     this.l = result[0]
     this.loadBasket()
     this.loadingService.sendMessage(true)
   
    },
               err=>{console.log(err) 
               this.loadingService.sendMessage(false) } )
  } 

  loadBasket(){
   // this.loadingService.sendMessage(false)

    let buyerId = localStorage.getItem(AppConstants.cookieBasketItems)
   
    let numberOfItems =0;
    if(!!buyerId){
     
      let url =`${AppConstants.getApiPathByName('basket','getBasket')}`
      this.basketService.getById(url,buyerId)
      .subscribe(val=>
        {
       if(!!val)
         { val.basketItems.map(x=>numberOfItems+=x.qty)
          this.loadingService.setBasketMessage(numberOfItems)
         }
         else
         this.loadingService.setBasketMessage(0)
        })
     
    }
    else{
   
      this.loadingService.setBasketMessage(0)
    
    }
    //this.basketService.getAll(url)
  }
  gotoShoppingCart(){
    this.router.navigate(['/Basket/Shopping-Cart']);
  }
  doSearch(event){
    if(event.key==="Enter"){
      this.SearchByname()
    }
    
  }
  SearchByname(){
 this.clicked =false;
    if(this.search !=='')  
  this.router.navigate(['./Search-items-page',this.search])
  else{
    this.clicked = true;
  }
  }
  @HostListener('window:scroll', ['$event'])
    handleScroll(){
      const windowScroll = window.pageYOffset;
      const windowWidth = window.innerWidth;
    //  console.log(windowScroll)
    //  console.log(windowWidth)
      
      if((windowWidth<= 990  && windowScroll>96)||(windowWidth > 990  && windowScroll>48))
         this.sticky = true;
         else
         this.sticky = false;

    }
}
