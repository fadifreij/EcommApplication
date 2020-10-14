import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService } from '../services';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(public userService: UsersService, public router: Router) {}

    canActivate(route: ActivatedRouteSnapshot):boolean | Observable<boolean>{
        return this.userService.isAuthenticated
    }
}