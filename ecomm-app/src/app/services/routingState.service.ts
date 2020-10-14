import { Injectable } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

@Injectable()
export class RoutingStateService {
  private history = [];
  private previousUrl: string = undefined;
  private currentUrl: string = undefined;
  constructor(private router: Router ) {

    this.currentUrl = this.router.url;
  //  console.log(this.router.url)
    router.events.subscribe(event => {
        if (event instanceof NavigationEnd) { 
            
          this.previousUrl = this.currentUrl;
          this.currentUrl = event.url;
        };
      });
  }

  public getPreviousUrl(){
    return this.previousUrl;
  }   
  public getCurrentUrl(){
      return this.currentUrl;
  }
}