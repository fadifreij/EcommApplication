import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {UsersService ,User}  from './../../../services/users.service'
import { AppConstants, ErrorParse } from 'src/app/constants/app-constants';
import {Router} from "@angular/router"
import { map } from 'rxjs/operators';
@Component({
    selector: 'register-users',
    templateUrl: './personalInfo.component.html',
    styleUrls: ['./personalInfo.component.css']
   
  })
  export class PersonalInfoComponent implements OnInit {
     userEmail:string = "";
     resetModel : any = {};
     oldPassword:string="";
     isResetting:boolean = false;
     resultMsg = "";
     updateResultMsg="";
     error : {'errCode': number , 'errList' : any[]}
     pageNumber:number = 1;
     firstName  = "";
     lastName = "";
    constructor(private usersService:UsersService ,private router :Router){

    }
    ngOnInit(): void {
       this.usersService.userInfo.subscribe(
           result=>{              
               this.userEmail = result.email
               this.getName();
            }
            )
    }
    public getName(){
       this.usersService.getAll(AppConstants.getApiPathByName("account","getName"))
       
       .subscribe((result:any)=>{
        
        if(!!result.firstName)
        this.firstName = result.firstName;
        if(!!result.lastName)
        this.lastName = result.lastName;
       },err=>{
          this.error = ErrorParse(err)
       })
    }
    public updateName(){
      let user :User ={username:"", email:"" ,password:"" ,firstName:this.firstName,lastName:this.lastName }
      this.usersService.create(AppConstants.getApiPathByName("account","updateName"),user)
      .subscribe(result=>{
           this.updateResultMsg ="First name and last name updated successfully.."
      },err=>{
         this.error = ErrorParse(err)
      })
    }
    navigateToPge(pageNumber:number){
       this.pageNumber = pageNumber;
    }
     logout(){
      this.usersService.logOut(AppConstants.getApiPathByName("account","logout"),this.usersService.getRefreshToken())
      .subscribe(response=>{
          
         //   this.usersService.deleteToken();
            this.router.navigate(["/"])
  
       },err=>{
         console.log(err)
       })
      //  this.logoutBtn.logout;
     }
     onResetSubmit(f:NgForm) {
      
       this.isResetting = true;
      
        let resetdata : User = { "email": this.userEmail ,"username":"","password":"", "oldPassword": this.resetModel.oldPassword, "newPassword": this.resetModel.newPassword}
        
        this.usersService.create(AppConstants.getApiPathByName("account","reset"), resetdata)
        .subscribe(result =>{
         this.isResetting=false;   
         this.resultMsg = "reset done successfully...";
         f.resetForm();

        },
        err=>{
           this.isResetting=false;
           console.log(err)
          this.error=ErrorParse(err);  
        }
        )
        
      
     }
  }