import { Component, OnInit } from '@angular/core';

import {AdminUserService, UserList} from './../../../services';
import { AppConstants, ErrorParse } from 'src/app/constants/app-constants';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
 
})
export class UsersComponent implements OnInit {
  public isLoading  = false;
  public isLoadingSpecial = false;
  public emailCriteria = "";
  public usernameCriteria = "";
  public userList :UserList[] =[];
  public action :string ="";
  public params = []
  public error :{'errCode':number ,'errList': any[]}
  constructor(private adminUserService :AdminUserService,private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams
    .subscribe(params => {
  
     
  if(!!params.action){
   
  this.params = params.action.split(',')
  
  if(this.params[0] == 'ALL'){
 
    this.getListOfUsers();
  }
  else 
  {
   
    this.usernameCriteria=this.params[1]
    this.emailCriteria=this.params[0]
    this.getListofUsersBy();
  }
  }
  
 //this.userId = params.userId;

});
  }

  // cancelled at the moment this is for list all button
  getListOfUsers(){
    this.isLoading = true;
    this.action = "ALL"
    this.emailCriteria=""
    this.usernameCriteria=""
    this.adminUserService.getAll(AppConstants.getApiPathByName("admin","listall"))
    .pipe(  map(res => res.map( resp =>   new UserList(resp.userId,
                                                      resp.userName,
                                                      resp.email,
                                                      resp.lockoutEnd,
                                                      !(!!resp.lockoutEnd),
                                                      resp.roleNamesForUser ,
                                                      resp.roles) )))
    .subscribe(result =>{
         this.isLoading = false;
      
          this.userList = result
    }
      ,err=> {
      //  this.isLoading = false;
       
       
      } )
    
  }


  getListofUsersBy(){
  
      let queryString  = "";

      if(this.emailCriteria!=""&&this.usernameCriteria!="")
      queryString =`${queryString}?email=${this.emailCriteria}&username=${this.usernameCriteria}`
      else if(this.emailCriteria!="")
      queryString = `${queryString}?email=${this.emailCriteria}`
      else if (this.usernameCriteria !="")
      queryString =  `${queryString}?username=${this.usernameCriteria}`
   
     
        this.action = `${this.emailCriteria},${this.usernameCriteria}`
      
      this.isLoadingSpecial=true;
        this.adminUserService.getAll(`${AppConstants.getApiPathByName("admin","listall")}${queryString}`)
        .pipe(  map(res => res.map( resp =>  new UserList(resp.userId,
                                                          resp.userName,
                                                          resp.email,
                                                          resp.lockoutEnd,
                                                          !(!!resp.lockoutEnd),
                                                          resp.roleNamesForUser,
                                                           resp.roles) )))
        .subscribe(result =>{
             this.isLoadingSpecial = false;
            
              this.userList = result
        }
          ,err=> {
            this.isLoadingSpecial = false;
           
            this.error = ErrorParse(err)
          
           
          } )

  }

  
}
