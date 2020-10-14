import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpSecureService } from './http-secure-service';
import { AppConstants } from '../constants/app-constants';
import { JwtHelperService } from "@auth0/angular-jwt";
import {  BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends  HttpSecureService<User> {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private userInfoSubject = new BehaviorSubject<UserInfo>({"username":"" ,"email":"", "role":""});
  public  userInfo = this.userInfoSubject.asObservable();

  constructor( httpClient : HttpClient) { 
    super(httpClient);
    this.updateAuth();// on refresh to check if is auth   
     }

public setCookie(token ,refreshToken){
  this.saveToken(token);
  this.saveRefreshToken(refreshToken);
  this.updateAuth();
}
public updateAuth() :void{
 
 let token = this.getToken(); 
 let helper  = new JwtHelperService();
 
if(!!token == false)
  { 
     this.isAuthenticatedSubject.next(false);
     this.userInfoSubject.next({"username":"","email":"","role":""})
  }
else
  { 
    var isExpired = helper.isTokenExpired(token);
    this.isAuthenticatedSubject.next(!isExpired);
    
    if(isExpired){
       this.userInfoSubject.next({"username":"","email":"","role":""});
       }
    else
    {
      let uInfo = new UserInfo() ;
   
      let tokenInfo = helper.decodeToken(token);
      
     
    (!!tokenInfo.unique_name==false)?uInfo.username="":uInfo.username=tokenInfo.unique_name;
    //  uInfo.username= tokenInfo.unique_name;

    (!!tokenInfo.email==false)?uInfo.email="":uInfo.email=tokenInfo.email;

    (!!tokenInfo.role == false)?uInfo.role="":uInfo.role=tokenInfo.role;
      this.userInfoSubject.next(uInfo);
    }
  }

 
 }
 public getToken():string{
  return  localStorage.getItem(AppConstants.cookieTokenName)
 }
public getRefreshToken():string{
  return localStorage.getItem(AppConstants.cookieRefreshName)
}

public logOut(path:string,refreshToken :string){
  
  this.deleteToken();
  
  let header = new HttpHeaders({ "content-type": "application/json", "Accept": "application/json" });
  return  this.httpClient.post(`${AppConstants.baseUrl}${path}`,JSON.stringify(refreshToken) ,{headers: header} )
}

 
 public saveToken(token:string){
  localStorage.setItem(AppConstants.cookieTokenName,token)
 }
 public deleteToken(){
   localStorage.removeItem(AppConstants.cookieTokenName);
   localStorage.removeItem(AppConstants.cookieRefreshName);
   this.updateAuth();
 }
 public saveRefreshToken(refreshToken :string){
   localStorage.setItem(AppConstants.cookieRefreshName,refreshToken)
 }
}

export class User{
    username : string;
    email:string;
    password :string;
    accessToken? :string ="";
    refreshToken? :string="";
    newPassword? :string="";
    oldPassword?:string= "";
    firstName? :string ="";
    lastName? : string = "";
}

export class UserInfo{
  username:string;
  role:string;
  email:string;
}


