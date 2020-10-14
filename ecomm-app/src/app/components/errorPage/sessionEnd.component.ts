import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'session-end',
  templateUrl: './sessionEnd.component.html',
 
})
export class SessionEndComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['nextRoute']);
  }, 5000);  //5s
  }

}