import { Component, OnInit } from '@angular/core';
import { MainmenuService ,mainmenu, SubMainmenuService,submainmenu,ProductsService,products} from './../../../services'
import { AppConstants } from 'src/app/constants/app-constants';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
 
})
export class ProductsComponent implements OnInit {
 isWorking:boolean;
 isloading :boolean;
 errMessage :string;
 selectedmainId:number;
 selectedsubmainId:number;
 mainmenulist : mainmenu[];
 submainmenulist:submainmenu[];
 productslist :products[];
  constructor(private mService : MainmenuService, 
              private sService : SubMainmenuService,
              private pService : ProductsService) { }

  ngOnInit(): void {
    this.isWorking = true;

    this.mService.getAll(AppConstants.getApiPath(1,'get')).subscribe(
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

  displaySubMenu(){
   this.isloading= true;
   this.selectedsubmainId = undefined;
   this.sService.getAll(`${AppConstants.getApiPath(2,'get')}/${this.selectedmainId}`)
   .subscribe(
     result=>{
      
       this.submainmenulist=result;
       this.isloading=false;
      },
     err=>{
         this.errMessage = err.message;
         this.isloading=false;
     }
   )
  }
  displayProducts(){
     if(!!this.selectedsubmainId)
      {
     this.isloading= true;
     this.pService.getAll(`${AppConstants.getApiPath(3,'get')}/${this.selectedsubmainId}`)
     .subscribe(
       result =>{
         this.isloading=false;
         this.productslist = result;
       },
       err=>{
         this.errMessage = err.message;
         this.isloading=false;
       }
     )
  }
  }
}
