import { Component, Input, OnInit, SimpleChanges, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { mainmenu, submainmenu, products } from 'src/app/services';

@Component({
    selector: 'mainMenu-template',
    templateUrl: './mainMenu-template.component.html',
    styleUrls: ['./mainMenu-template.component.css']
    
  })
  export class MainMenuTemplateComponent implements OnInit  ,OnChanges{
    @Input()  isBanner :boolean ;
    @Input() modelMainMenu : mainmenu;
   
    @ViewChild('navbarid', {static: false}) navbaridRef: ElementRef<any>;
    mainMenuName :string;
    private subMainMenuName :submainmenu[] ;
    public list  =[];
    private subList =[];
   // private products : products[];
  
     private numberOfSubList :number ; 
  constructor(){}
  // interms of sending input that needs wait from subscribe we have 2 solution :
  //Either we put *ngIf  to the child component and constinue get it from ngOnInit()
  // Or use ngOnChanges and get it from there .

  //In our case i used the first solution;
 ngOnChanges(changes:SimpleChanges){
 /*  if((!!changes['modelMainMenu']))
   console.log(this.modelMainMenu)*/
 } 
 onClick(val){
   this.navbaridRef.nativeElement.hidden=val;
 }
 ngOnInit(){
    this.numberOfSubList = (this.isBanner)?3:4;
  
 
   for(var i = 0 ; i < this.numberOfSubList ;i++ )
      this.list.push([]);
  
    this.mainMenuName = this.modelMainMenu.mainMenuName;
    this.subMainMenuName = this.modelMainMenu.subMainMenu;
 
   
 
    // take first 3 or 4 submain menu to push it to temperoray variable 
   if(this.subMainMenuName.length < this.numberOfSubList)
       {
         for(var i = 0 ; i <this.subMainMenuName.length ; i ++)
          this.list[i].push(this.subMainMenuName[i])
       }
       else{
       for(var i = 0 ; i < this.numberOfSubList; i++)
        this.list[i].push(this.subMainMenuName[i])
        
        
        let index = this.numberOfSubList-1; // take the last index to start filling in
       for (var y = this.numberOfSubList ; y< this.subMainMenuName.length; y++){
        
        this.list[index].push(this.subMainMenuName[y]);
        index--;
        if(index == -1)
        index = this.numberOfSubList-1;
        
       }
   }
    
 
  
  
 }
}