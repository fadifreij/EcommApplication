import { Component, OnInit ,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { MainmenuService,mainmenu} from './../../../services/mainmenu.service';
@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./../admin.component.css'],
  providers:[MainmenuService]
 
})
export class MainmenuComponent implements OnInit {
  ngOnInit():void{
    
  }
/*
 public list : mainmenu[]
 public error 
 public isloading : boolean
  constructor(public dialog: MatDialog 
              ,private service : MainmenuService) { }


  ngOnInit(): void {
    this.getAll();
  }
 
  getAll()  {
     this.isloading = true;
     this.service.getAll('/api/MainMenu/GetAll').subscribe(
       result => {   this.list = result },
       err => { this.error = err.message },
       () => { this.isloading =false; }
     )

    
  }

  openDialog(dialogType,record?): void {
  var  currentRecord : DialogData = { id : 0 , name :"" ,active : "", mainmenuList : this.list ,dialogType:dialogType};
   
   if(!!record){
    currentRecord  ={id : record.id, name : record.mainMenuName , active: (record.show)?'true':'false' ,mainmenuList : this.list ,dialogType:dialogType}
    
     
   }
   
  
  
    const dialogRef = this.dialog.open(DialogMainMenu, {
      width: '400px',
      disableClose:false  // false - enable escape close
      ,
     // data: {name:  name, active: active}
     data :currentRecord
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if(!!result)
      this.list = result;
     
   
    });
  }

  
  
}
//Dialog class
@Component({
  selector: 'dialog-mainmenu',
  templateUrl: 'dialog-mainmenu.html',
})
export class DialogMainMenu {
  title  = "Please fill mainmenu name and active";
  isSaving = false;
  errMessage ="";
  constructor(
    public dialogRef: MatDialogRef<DialogMainMenu>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData ,
    private service : MainmenuService
    ) {
   
    }
  checkValidity() :boolean {
   //check mainmenu name field
    if(this.data.name =="")
        { 
         console.log("passed")
          this.title ="Please fill mainmenu name field !"  
          return false;  
         }
   //check active field
     if(this.data.active == "")  
     {
      this.title ="Please fill active field !"  
      return false; 
     } 
     
     // check if name exists before
   var exists =  this.data.mainmenuList.filter(
       m=>(m.mainMenuName.toLowerCase() == this.data.name.toLowerCase()) && (m.id != this.data.id)
     )
     if(exists.length != 0) {
       this.title ="This name is already exists please choose another name"
       return false;
     }
     
    return true;
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }
  closeDialogwithSave():void{
     if(this.checkValidity() == true)
     {

      const dataToSave : mainmenu ={ id : this.data.id , mainMenuName:this.data.name, show:(this.data.active =='true')?true:false}
     
     this.isSaving =true;
      this.service.create('/api/MainMenu/Add',dataToSave)
      .subscribe(result =>{
       
        this.dialogRef.close(result)
      },err=>{
        this.isSaving=false;
       this.errMessage = err.message;
      },()=>{
        this.isSaving =false;
      }
      )
       
    }
  }
  closeDialogwithDelete():void{
    this.isSaving =true;
    this.service.deleteById('/api/MainMenu/Delete',this.data.id)
        .subscribe(result=>{
          this.dialogRef.close(result)
        },
        err=>{
          this.isSaving=false;
          this.errMessage =err.message;
        },
        ()=>{
          this.isSaving=false;
        })
  }
*/
}
/*
// data exchange between popup and component
export interface DialogData {
  id :number;
 name : string;
 active :string;
 mainmenuList : mainmenu[];
 dialogType : string;
}

*/

