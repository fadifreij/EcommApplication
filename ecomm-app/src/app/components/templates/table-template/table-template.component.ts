import { Component, OnInit ,Input, Inject,OnChanges} from '@angular/core'
import { MainmenuService,mainmenu}  from './../../../services/index'
import {SubMainmenuService, submainmenu} from './../../../services/index'
import {ProductsService ,products} from './../../../services/index'

import { AppConstants} from './../../../constants/app-constants'

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'table-template',
  templateUrl: './table-template.component.html',
  styleUrls: ['./../../admin-page/admin.component.css']
  
})
export class TableTemplateComponent implements OnChanges {

 //define the input  1 - 2 - 3
 @Input() modelnumber :number;
 @Input() mainmenuId :number;
 @Input() submainmenuId :number;

 // public list : mainmenu[] | submainmenu[] | products[];
  public listToDisplay : ModelData[];
  public error: string;
  public isWorking :boolean;
  //public modelType : Type<mainmenu | submainmenu | products>;


  constructor(public dialog: MatDialog ,
              private mService : MainmenuService,
              private sService : SubMainmenuService,
              private pService :ProductsService 
              ) { }

  
 ngOnChanges(){
  
  this.getAll();
 }
  // fetch all data 
  getAll():void{
   
    let operation :  Observable<mainmenu[] | submainmenu[] | products[]>
  

    let path = AppConstants.getApiPath(this.modelnumber,'get');
        
    if(this.modelnumber ==1){ operation =  this.mService.getAll(path) }
    else if(this.modelnumber ==2){ operation = this.sService.getAll(`${path}/${this.mainmenuId}`) }
    else if(this.modelnumber ==3){ operation = this.pService.getAll(`${path}/${this.submainmenuId}`)}
   
    this.isWorking = true;
    operation.subscribe(
    result =>{  
                this.isWorking=false;
                
                this.listToDisplay =this.getList(result,this.modelnumber)
                },
    err =>{ this.error = err.message 
            this.isWorking = false;})

  

  }

  // put the data in the common module to display 
  getList(model : mainmenu[] | submainmenu[] | products[] , modelnumber :number) : ModelData[]{
   let result : ModelData[]  =[];
  
  
   if (modelnumber ==1){
       var k1 = model as mainmenu[];
       for(var i = 0 ; i < k1.length ;i++ )
         {
              let element1 : ModelData ;
      
              element1 = { id : k1[i].id , 
                           name : k1[i].mainMenuName , 
                           active : `${k1[i].show}` , 
                           List:null ,dialogType :'' ,
                           modelnumber:this.modelnumber,
                           mainmenuId :this.mainmenuId,
                           submainmenuId:this.submainmenuId
                           }
              result.push(element1);
         }
     }
    else if(modelnumber ==2){
     
      var k2 = model as submainmenu[];
       for (var  i = 0 ; i<k2.length; i++){
           let element2 :ModelData;
           element2 = { id :k2[i].id ,
                        name : k2[i].subMainMenuName , 
                         active : `${k2[i].show}` ,
                         List :null ,dialogType:'',
                         modelnumber:this.modelnumber,
                         mainmenuId:this.mainmenuId,
                         submainmenuId:this.submainmenuId}
            result.push(element2)
        }
    }
    else if(modelnumber ==3){
      var k3 = model as products[];
      for (var i = 0 ; i <k3.length ;i++){
        let element3 : ModelData;
        element3 =  { id :k3[i].id ,
                      name : k3[i].productName , 
                      active : `${k3[i].show}` ,
                      List :null ,dialogType:'',
                      modelnumber:this.modelnumber,
                      mainmenuId:this.mainmenuId,
                      submainmenuId:this.submainmenuId}
        result.push(element3)
      }
    }
   return result;
  }

  //open Dialog
  openDialog(dialogType,record?): void {
    var  currentRecord : ModelData = { id : 0 , name :"" ,active : "", List : this.listToDisplay ,dialogType:dialogType ,modelnumber:this.modelnumber  ,mainmenuId:this.mainmenuId, submainmenuId:this.submainmenuId};
   
    if(!!record){
     currentRecord  ={ id : record.id, name : record.name , active: record.active ,List : this.listToDisplay ,dialogType:dialogType ,modelnumber:this.modelnumber ,mainmenuId:this.mainmenuId,submainmenuId:this.submainmenuId}
           
    }
  
  
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '400px',
      disableClose:false  // false - enable escape close
      ,
     // data: {name:  name, active: active}
     data :currentRecord
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if(!!result)
      this.listToDisplay = this.getList(result,this.modelnumber);
     
   
    });
  }

}

//dialog for template
@Component({
  selector: 'dialog-template',
  templateUrl: './dialog-template.html'
 
})
export class DialogTemplateComponent implements OnInit {
  title  = "Please fill  name and active";
  isSaving = false;
  errMessage ="";
  
  
  constructor(
    public dialogRef: MatDialogRef<DialogTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModelData,
    private mService : MainmenuService,
    private sService : SubMainmenuService,
    private pService : ProductsService
  ) { }

  ngOnInit(): void {
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
    var exists =  this.data.List.filter(
        m=>(m.name.toLowerCase() == this.data.name.toLowerCase()) && (m.id != this.data.id)
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
      let operation :  Observable<mainmenu | submainmenu | products>
      if (this.data.modelnumber ==1){
          const dataToSave : mainmenu ={ id : this.data.id , mainMenuName:this.data.name, show:(this.data.active =='true')?true:false}
           this.isSaving = true;
           operation =  this.mService.create(AppConstants.getApiPath(this.data.modelnumber,"add"), dataToSave)
      }
      else if (this.data.modelnumber ==2) {
            const dataToSave : submainmenu ={id :this.data.id , subMainMenuName:this.data.name, show:(this.data.active=='true')?true:false ,mainMenuId:this.data.mainmenuId }
            this.isSaving=true;
            operation = this.sService.create(AppConstants.getApiPath(this.data.modelnumber,"add"), dataToSave)
      }else if( this.data.modelnumber == 3 ){
            const dataToSave :products ={ id : this.data.id , productName:this.data.name , show:(this.data.active=='true')?true:false ,subMainMenuId:this.data.submainmenuId}
            this.isSaving=true;
            operation = this.pService.create(AppConstants.getApiPath(this.data.modelnumber,"add"), dataToSave)
      }

      operation.subscribe(result =>{
        
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
    let operation :  Observable<object>
      if (this.data.modelnumber ==1){
          
           this.isSaving = true;
           operation =  this.mService.deleteById(AppConstants.getApiPath(this.data.modelnumber,"delete"), this.data.id )
      }
      else if (this.data.modelnumber ==2) {
            
            this.isSaving=true;
            operation = this.sService.deleteById(AppConstants.getApiPath(this.data.modelnumber,"delete"), this.data.id)
      }else if( this.data.modelnumber == 3 ){
           
            this.isSaving=true;
            operation = this.pService.deleteById(AppConstants.getApiPath(this.data.modelnumber,"delete"), this.data.id)
      }

      operation.subscribe(result =>{
       
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

// data exchange between popup and component
export class ModelData {
  id :number;
 name : string;
 active :string;
 List : ModelData[];
 dialogType : string;
 modelnumber :number;
 mainmenuId :number;
 submainmenuId :number;
}

