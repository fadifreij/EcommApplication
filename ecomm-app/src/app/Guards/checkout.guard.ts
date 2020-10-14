import { ActivatedRouteSnapshot, Router, CanActivate } from '@angular/router';
import { UsersService } from '../services';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { BasketService } from '../services/basket.service';

@Injectable()
export class CheckOutGuardService implements CanActivate {
    constructor(private userService: UsersService,
                private basketService: BasketService,

                public router: Router) {}

    canActivate(route: ActivatedRouteSnapshot):boolean | Observable<boolean>{
    //  console.log(route.routeConfig.path)
    // console.log( this.router.routerState.snapshot.url)
    return this.basketService.loadshoppingBasket().pipe(
       map(val =>{
        
         if(val ===null){
           if(this.router.routerState.snapshot.url ==='')
               this.router.navigate(['./'])
             return false;
         }
          else{
            if(!!val.basketItems)
           {
               let items = val.basketItems.filter(x=>x.inBasket==true)
             if(items.length==0){
              if(this.router.routerState.snapshot.url ==='')
               this.router.navigate(['./'])
             
              return false;
             }
             return true;
            }
           else{

            if(this.router.routerState.snapshot.url ==='')
               this.router.navigate(['./'])
             return false;
           }
          }
       })
    )
       
      
    }
}