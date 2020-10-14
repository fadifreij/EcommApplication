import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest,HttpResponse,HttpErrorResponse, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, take, switchMap} from 'rxjs/operators'
import { Router } from '@angular/router';
import { RefreshTokenService, UsersService } from '../services';
import { AppConstants, ErrorParse } from '../constants/app-constants';

/**
 * @author Pravin P Patil
 * @version 1.0
 * @description Interceptor for handling requests which giving 401 unauthorized and will call for 
 * refresh token and if token received successfully it will call failed (401) api again for maintaining the application momentum
 */
@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


    constructor(private http: HttpClient 
        ,private uService : UsersService
        ,private rService :RefreshTokenService
        ,private router :Router){}

  /**
     * 
     * @param request HttpRequest
     * @param next HttpHandler
     * @description intercept method which calls every time before sending requst to server
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

         //send the request if the api is  not authorized;
        let requestType = request.headers.get('Request-Type');
      
        if(requestType =="" || request.url.indexOf('Login')!== -1 || request.url.indexOf('Logout')!== -1 )  return next.handle(request)
        
        // Taking an access token
          const accessToken = this.uService.getToken();
         
          // return request if accessToken is null
          if(accessToken==null) return next.handle(request);


        // cloing a request and adding Authorization header with token
         request = this.addToken(request, accessToken);
         // sending request to server and checking for error with status 401 unauthorized
         return next.handle(request).pipe(
             catchError(error =>{
               
            //  console.log(error)
                if (error instanceof HttpErrorResponse && error.status === 401) {
                // calling refresh token api and if got success extracting token 
                //from response and calling failed api again due to 401
               
               
                 return this.handle401Error(request, next);
                }else if(error.status ==404){
                    //return error page not found
                    return throwError(error)
                }
                else{
                    //redirect to session end  to let the user login again
                  
                    if(error.status==403) // forbidden access
                    {// redirect to session end  since the user not allowed to access the api after token time finished
                      
                      
                        return throwError(error)
                    }
                  
                  console.log(error)
                  // this come from any request if an error happen return error to the page
                  // this is of type HttpErrorResponse
                    return throwError(error)
                }
            } // end of error
                ) // end of catchError
            
         )
    }

     /**
     * 
     * @param request HttpRequest<any>
     * @param token token to in Authorization header
     */
    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: { 'Authorization': `Bearer ${token}` }
        });
    }

 /**
     * This method will called when any api fails due to 401 and calls for refresh token
     */
    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
         // If Refresh token api is not already in progress
         if (this.isRefreshing) {
           
             // If refreshTokenInProgress is true, we will wait until 
             //refreshTokenSubject has a non-null value
             //which means the new token is ready and we can retry the request again
             return this.refreshTokenSubject
             .pipe(
                filter(token=>token!=null), 
                take(1),
                switchMap(jwt=>{
                    return next.handle(this.addToken(request, jwt))
                }))
           }else{
               // updating variable with api is in progress
               this.isRefreshing = true;
               // Set the refreshTokenSubject to null so that subsequent API
               //  calls will wait until the new token has been retrieved
               this.refreshTokenSubject.next(null);

               const refreshToken = this.uService.getRefreshToken();
               return  this.rService.create(AppConstants.getApiPathByName("account","refresh"),JSON.stringify(refreshToken))
               .pipe(
                catchError(error=>{
                   // here come from error refresh account api when the refresh token expired
                    this.isRefreshing=false;
                    this.uService.logOut(AppConstants.getApiPathByName("account","logout"),this.uService.getRefreshToken())
                                 
                    this.router.navigate(['/session-end'])
                    return throwError(error);
                }),
                switchMap((tokens)=>{
                this.isRefreshing = false;
                this.refreshTokenSubject.next(tokens.accessToken);
                 // updating cookies 
                 this.uService.saveToken(tokens.accessToken) ; 
                 this.uService.saveRefreshToken(tokens.refreshToken);
                 return next.handle(this.addToken(request, tokens.accessToken));
               }
               ) // close switchMap
               ) // close pipe
           }
    }

        
}