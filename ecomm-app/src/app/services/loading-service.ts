import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
    private subject = new BehaviorSubject<any>(false);
    
    private basketSubject = new BehaviorSubject<any>(0);
    public basket = this.basketSubject.asObservable();
    sendMessage(message: boolean) {
        this.subject.next(message);
    }
    /*clearMessage() {
        this.subject.next();
    }*/
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

   setBasketMessage(message :number){
       this.basketSubject.next(message);
   }
}