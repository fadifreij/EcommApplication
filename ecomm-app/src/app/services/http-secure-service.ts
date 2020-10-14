import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericHttpService } from './genric-http-service';
import { AppConstants } from '../constants/app-constants';
@Injectable()
  export class HttpSecureService<T> extends GenericHttpService<T> {
   
    constructor( httpClient: HttpClient){
            super(httpClient);
            this.requestType="secure";
            this.url = AppConstants.baseUrl
            }
  }