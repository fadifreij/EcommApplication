import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserList, AdminUserService } from 'src/app/services';
import { AppConstants } from 'src/app/constants/app-constants';
@Component({
    selector: 'app-edit-users',
    templateUrl: './editUser.component.html',
   
  })
  export class EditUserComponent implements OnInit {
   public userId :string ="";
   public username :string="";
   public email :string ="";
   public roleNamesForUser = [];
   public roles = [];
   public isActive :boolean;
   public userCompAction :string ="";
   constructor(private route: ActivatedRoute 
               ,private router: Router
               ,private adminUserService:AdminUserService){

   }
    ngOnInit(): void {
      
        this.route.queryParams
           .subscribe(params => {
      //  console.log(params); // {order: "popular"}

        this.userCompAction = params.action;
   
      });
       
      const  resolvedData : UserList | string = this.route.snapshot.data['userList']
     
      let data = (<UserList> resolvedData)
      this.userId = data.userId;
      this.email = data.email;
      this.username = data.userName;
      this.isActive = (data.lockoutEnd=="");
      this.roles = data.roles;
      this.roleNamesForUser=data.roleNamesForUser;
     
    }

    addRole(roleName :string){
      this.roleNamesForUser.push(roleName)  
     
      const index: number = this.roles.findIndex(x=>x.roleName == roleName);
     
      this.roles.splice(index,1)
     
   
    }
    removeRole(roleName :string){
       var r = {roleId :11111-1111, roleName : roleName}
     this.roles.push(r)
       
     let index =  this.roleNamesForUser.findIndex(r=>r == roleName)
     this.roleNamesForUser.splice(index,1)
    
    }
    changeActive(event){
      
        this.isActive = event.checked
    }
    saveEditUser(){
        var model :UserList  = { userId : this.userId , 
                                 isActive: this.isActive ,
                                 email :'',
                                 roleNamesForUser :<any> this.roleNamesForUser,
                                 roles :<any> this.roles.map(r=>r.roleName) ,
                                 userName :'',
                                 lockoutEnd :'' }
     
                             
     this.adminUserService.create(AppConstants.getApiPathByName("admin","editRole") ,model)
     .subscribe(result=>
        { this.router.navigate(['/Admin/Users'],{ queryParams:{ action: this.userCompAction }}) },
         err=>console.log(err)
     )
                                 
    }  
  }