import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'error-alert',
  templateUrl: './error-alert.component.html',
 
})
export class ErrorAlertComponent implements OnInit {
@Input() errorModel : {'errCode': string , 'errList' : []};
  constructor() { }

  ngOnInit(): void {
  }

}