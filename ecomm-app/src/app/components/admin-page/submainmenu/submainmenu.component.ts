import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MainmenuService,mainmenu,SubMainmenuService,submainmenu} from './../../../services/index'
import { AppConstants } from 'src/app/constants/app-constants';
@Component({
  selector: 'app-submainmenu',
  templateUrl: './submainmenu.component.html',
  styleUrls: ['./../admin.component.css']
 
})
export class SubmainmenuComponent implements OnInit {
  mainmenulist : mainmenu[];

  isWorking :boolean;
  errMessage ="";
  selectedId =""
  
  constructor( 
              private mainMenuService : MainmenuService ,
              private subMainMenuService : SubMainmenuService) { }

  ngOnInit(): void {
    this.isWorking = true;

    this.mainMenuService.getAll(AppConstants.getApiPath(1,'get')).subscribe(
        result=>{
          this.mainmenulist = result;
         
        },
        err=>{
            this.errMessage = err.message;
            this.isWorking=false;
        },
        ()=>{
           this.isWorking=false;
        }
    )
  }
}