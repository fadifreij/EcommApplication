import { HttpService } from './http-service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
  export class RefreshTokenService extends  HttpService<any> {
    constructor( httpClient : HttpClient) { 
        super(httpClient);
       
          
         }
  }

  