import { Component, OnInit } from '@angular/core';
import {UsersService , User} from './../../../services'
import { AppConstants, ErrorParse } from 'src/app/constants/app-constants';
import { NgForm } from '@angular/forms';
import {Router, ActivatedRoute} from "@angular/router"
@Component({
  selector: 'register-users',
  templateUrl: './register.component.html',
 
})
export class RegisterComponent implements OnInit {
  registerModel :any = {}
  loginModel :any ={}
  isRegister = false;
  isLogin = false;
  registerError : {'errCode':number , 'errList':any[]}
  loginError : {'errCode':number , 'errList':any[]}
  redirectTo = "";

  constructor(private userService:UsersService,
              private router: Router,
              private route:ActivatedRoute) { }

  ngOnInit(): void {
   this.route.queryParams.subscribe(url=>{
   
   if(!!url.redirectUrl)
   this.redirectTo = url.redirectUrl;
   else
   this.redirectTo=""
   
   })
  }
onRegisterSubmit(f:NgForm) :void {
 
  this.registerError =null;
  
  this.isRegister = true;
  let user :User = { username : this.registerModel.name , password : this.registerModel.password , email : this.registerModel.email};
  
  this.userService.create(AppConstants.getApiPathByName("account","register"),user)
  .subscribe(response  =>{
    
    this.userService.setCookie(response.accessToken,response.refreshToken)
    f.resetForm();
   this.isRegister=false;
   this.router.navigate([`/${this.redirectTo}`]);
  },
  err=>{
     
  /*  this.errMsgRegister = err.error.errorDescription;
    this.errMsgRegisterList = err.error.errors;*/
  
   this.registerError = ErrorParse(err);
  
    this.isRegister = false;
  })
 

}
onLoginSubmit(f:NgForm):void{
  this.loginError=null;
  let user:User = { username:"" , password: this.loginModel.password ,email:this.loginModel.email }
  this.isLogin=true;
  this.userService.create(AppConstants.getApiPathByName("account","login"),user)
  .subscribe(
    response=>{
      this.userService.setCookie(response.accessToken,response.refreshToken)
      f.resetForm();
      this.isLogin=false;
      this.router.navigate([`/${this.redirectTo}`])
    },
    err=>{
      console.log(err)
      this.loginError =  ErrorParse(err);
      this.isLogin=false;
    }
  )
}

clearRegisterModel(){
  this.registerModel = {};
}
}
