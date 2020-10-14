import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable ,of  } from 'rxjs';
import { map ,catchError  } from 'rxjs/operators';
import { AdminUserService, UserList } from './adminUser.service';
import { AppConstants } from '../constants/app-constants';
@Injectable()
export class UserListResolverService implements Resolve<UserList | string>{
  
    constructor(private adminService :AdminUserService){}
  
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | UserList | Observable<string | UserList> | Promise<string | UserList> {
   
    // console.log(route);
     return     this.adminService.getById(AppConstants.getApiPathByName("admin","getUser"),route.queryParams.userId)
               .pipe(
                      catchError((err: string) =>  of(err))
                     );
    }
}