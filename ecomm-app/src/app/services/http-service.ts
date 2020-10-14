import { Injectable } from '@angular/core';
import { GenericHttpService } from './genric-http-service';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../constants/app-constants';

@Injectable()
  export class HttpService<T> extends GenericHttpService<T>  {
    constructor( httpClient: HttpClient ){
           super( httpClient)
           this.requestType ="";
           this.url = AppConstants.baseUrl
       }
  }
