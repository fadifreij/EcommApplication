import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService } from '../services';
import { Observable } from 'rxjs';
@Injectable()
export class AdminStaffGuardService implements CanActivate {
    constructor(public userService: UsersService, public router: Router) {}

    canActivate(route: ActivatedRouteSnapshot):boolean | Observable<boolean>{
      let userInfo :any;
      let continueNavigation = false;
      const expectedRole = route.data.expectedRole;
    
     
        this.userService.userInfo.subscribe(info=>
      {
        
        userInfo = info
        
       if (userInfo.role instanceof Array){
          let k =   userInfo.role.map(u=>(<string>u).toLowerCase())
       
        let allowedRoles  = expectedRole.split(",")
        
        continueNavigation = k.some(u=>allowedRoles.indexOf(u));
      
       }
      else{
     
        let allowedRoles = expectedRole.split(",")
        continueNavigation = (allowedRoles.includes(userInfo.role.toLowerCase()))
        } 
      }
     
        )
     
       
      if(continueNavigation)
          return true;
     
        
     /*  if( this.router.url.indexOf('Admin') == -1)
        this.router.navigate(['./forbidden'])
        else*/
        this.router.navigate(['/session-end'])
        return false;
      
    }
}