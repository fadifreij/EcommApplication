import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainPageComponent} from './../components/main-page/main-page.component'
import { ItemsPageComponent } from '../components/items-page/items-page.component';

import {RegisterComponent} from './../components/admin-page/users/register.component'

import {HomeComponent} from './../components/admin-page/home/home.component'
import {UsersComponent} from './../components/admin-page/users/users.component'
import {MainmenuComponent} from './../components/admin-page/mainmenu/mainmenu.component'
import { SubmainmenuComponent } from './../components/admin-page/submainmenu/submainmenu.component';
import {ProductsComponent} from './../components/admin-page/products/products.component'
import {ItemsComponent} from './../components/admin-page/items/items.component'
import {AdminComponent } from '../components/admin-page/admin.component';
import {PersonalInfoComponent } from '../components/admin-page/users/personalInfo.component';
import {EditUserComponent } from '../components/admin-page/users/editUser.component';
import { UserListResolverService } from '../services';
import { SessionEndComponent } from '../components/errorPage/sessionEnd.component';
import { ForbiddenComponent } from '../components/errorPage/forbidden.component';
import { AdminStaffGuardService } from '../Guards/adminStaff.guards';
import { BasketDetailComponent } from '../components/basketDetail/basketDetail-component';
import { ItemDetailComponent } from '../components/itemDetail/item-detail.component';
import { MyWhishListComponent } from '../components/myWhishlist/mywhishlist.component';
import { SearchPageComponent } from '../components/search-page/search-page.component';
import { CheckOut1Component } from '../components/checkout/checkout1.component';
import {  CheckOutGuardService } from '../Guards/checkout.guard';
import { AuthGuardService } from '../Guards/auth.guard';
import { CheckOut2Component } from '../components/checkout/checkout2.component';
import { CheckOut3Component } from '../components/checkout/checkout3.component';
import { CheckOut4Component } from '../components/checkout/checkout4.component';




const routes: Routes = [
  { path: '' ,
   component:MainPageComponent
  },
 
  {path :'Items/:mainMenu/:subMainMenu/:product' ,component:ItemsPageComponent
   }
  ,
  {path:'Register' ,component:RegisterComponent},
  { path: 'Admin'  , component:AdminComponent,
   children : [
     {path :'' , component: HomeComponent ,canActivate:[AdminStaffGuardService] ,data:{expectedRole:'admin,staff'}},
     {path:'Users/Edit-User' ,component:EditUserComponent , resolve:{ userList: UserListResolverService}},
     {path :'Users',component:UsersComponent ,
      canActivate :[AdminStaffGuardService],
      data : { expectedRole : 'admin' }
      },
     {path :'MainMenu' , component: MainmenuComponent ,
      canActivate:[AdminStaffGuardService],
       data:{expectedRole:'admin,staff'}},
     {path :'SubMainMenu' ,component:SubmainmenuComponent,
     canActivate :[AdminStaffGuardService] ,
      data:{expectedRole :'admin,staff'}},
     {path :'Products' ,component:ProductsComponent,
      canActivate:[AdminStaffGuardService],
       data:{expectedRole:'admin,staff'}
      },
     {path :'Items', component:ItemsComponent ,
       canActivate :[AdminStaffGuardService],
       data:{expectedRole:'admin,staff'}
      }
     
    
   ]
    
  },
  {path :'session-end' ,component:SessionEndComponent},
  {path :'forbidden' ,component:ForbiddenComponent},
  {path :'Personal-Info',component:PersonalInfoComponent ,canActivate:[AuthGuardService] },
  {path :'Basket/Shopping-Cart' , component:BasketDetailComponent ,canActivate:[CheckOutGuardService]},
  {path :'Item-Detail/:pId' , component:ItemDetailComponent},
  {path :'My-Wishlist',component:MyWhishListComponent},
  {path :'Search-items-page/:criteria',component:SearchPageComponent},
  {path :'Checkout-1',component:CheckOut1Component ,canActivate:[AuthGuardService,CheckOutGuardService]},
  {path :'Checkout-2',component:CheckOut2Component ,canActivate:[AuthGuardService,CheckOutGuardService]},
  {path :'Checkout-3',component:CheckOut3Component ,canActivate:[AuthGuardService,CheckOutGuardService]},
  {path :'Checkout-4',component:CheckOut4Component ,canActivate:[AuthGuardService]},
  {path :'**' ,redirectTo:''}
 // { path: '' , redirectTo: '/mainPage',pathMatch:'full'}
];

@NgModule({
  imports: [
   
  RouterModule.forRoot(routes ,{onSameUrlNavigation: `reload`,scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
