import { Injectable } from '@angular/core';
import { HttpSecureService } from './http-secure-service';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
  })
export class KeyTableService extends  HttpSecureService<KeyTable> {
 
    constructor(public httpClient : HttpClient) { 
      super(httpClient);
            
       } 
  
  }


export class KeyTable {
    id:number;
    name :string;
    tableName :string;
  }