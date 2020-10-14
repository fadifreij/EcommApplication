import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpSecureService } from './http-secure-service';
import { submainmenu } from './submainmenu.service';



@Injectable({
  providedIn: 'root'
})
export class ProductsService extends  HttpSecureService<products> {
 
  constructor( httpClient : HttpClient) { 
    super(httpClient);
   
      
     }



}

export class products{
  id:number;
  productName:string;
  show : boolean;
  subMainMenuId :number;
  subMainMenu? : submainmenu;

}
