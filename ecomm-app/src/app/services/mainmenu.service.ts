import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpSecureService } from './http-secure-service';
import {submainmenu} from './submainmenu.service';

@Injectable({
  providedIn: 'root'
})
export class MainmenuService extends  HttpSecureService<mainmenu> {
 
  constructor( httpClient : HttpClient) { 
    super(httpClient);
   
      
     }



}

export class mainmenu{
  id:number;
  mainMenuName:string;
  show : boolean;
  subMainMenu? : submainmenu[];

}
