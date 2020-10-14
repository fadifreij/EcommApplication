import { Directive, ElementRef, Input, OnInit, ViewContainerRef, TemplateRef } from '@angular/core';
import {UsersService} from './../services'
import { JwtHelperService } from "@auth0/angular-jwt";
@Directive({
    selector: '[auth]'
  })
  export class AuthDirective implements OnInit {
   condition:boolean
    @Input() set auth(condition:boolean){
      this.condition = condition
    }
    @Input('roles') roles  = ""
    constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef ,private userService:UsersService) {
      
      
      }
      ngOnInit() {
        let userInfo : any
       let listofRoles = this.roles.split(",").map(r=>r.toLowerCase())
           
  //  console.log(listofRoles)
       this.userService.isAuthenticated.subscribe( 
           isAuth =>{
          
            this.userService.userInfo.subscribe(user=> {       
              userInfo = user
           
              let k =""
              if(userInfo.role != "" && (!!userInfo.role))
           { 
            
             if(userInfo.role  instanceof Array)
              k =   userInfo.role.map(r=> r.toString().toLowerCase())
              else
              k = userInfo.role.toLowerCase();
            }
          
           
              const inRole = listofRoles.some(r=> k.indexOf(r) >= 0 && r!="")
           //  console.log(listofRoles)
            // console.log(userInfo.role)
            //  console.log(inRole)
              if( ((isAuth && this.condition) || (!isAuth && !this.condition)) && (this.roles== "" || inRole))
              {
                
                 this.viewContainer.createEmbeddedView(this.templateRef);
              }
              else{
                 
                  this.viewContainer.clear();
              }
                 
           
            })
            
           
            
        }
       )



       
       
      }
  }