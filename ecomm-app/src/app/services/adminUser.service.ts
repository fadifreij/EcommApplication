
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpSecureService } from './http-secure-service';
@Injectable({
    providedIn: 'root'
  })
  export class AdminUserService extends  HttpSecureService<UserList> {


    constructor( httpClient : HttpClient) { 
        super(httpClient);
                 
         }
  }
  
  export class UserList{
      userId : string;
      userName :string;
      email:string;
      lockoutEnd : string;
      isActive : boolean;
      roleNamesForUser: [];
      roles :[];

      constructor(userId :string, userName:string ,email:string ,lockoutend :string ,isActive:boolean, roleNamesForUser:[] ,roles:[]){
       this.userId= userId;
       this.userName = userName;
       this.email = email;
       this.lockoutEnd= lockoutend;
       this.isActive= isActive;
       this.roleNamesForUser = roleNamesForUser;
       this.roles=roles;
      }
  }