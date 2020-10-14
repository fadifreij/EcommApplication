import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpSecureService } from './http-secure-service';
import {products} from './product.service';
import { mainmenu } from './mainmenu.service';

@Injectable({
  providedIn: 'root'
})
export class SubMainmenuService extends  HttpSecureService<submainmenu> {
 
  constructor( httpClient : HttpClient) { 
    super(httpClient);
         
     }



}

export class submainmenu{
  id:number;
  subMainMenuName:string;
  show : boolean;
  mainMenuId :number;
  products? : products[];
  mainMenu? : mainmenu;
}