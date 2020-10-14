import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';


import { HeaderComponent } from './../components/header/header.component';
import { FooterComponent } from './../components/footer/footer.component';
import { MainPageComponent } from './../components/main-page/main-page.component';

import {RegisterComponent} from './../components/admin-page/users/register.component';

import { TableTemplateComponent } from './../components/templates/table-template/table-template.component';
import { MainMenuTemplateComponent } from '../components/templates/MainMenu-template/mainMenu-template.component';


import { AdminComponent } from './../components/admin-page/admin.component';
import {HomeComponent} from './../components/admin-page/home/home.component'
import {UsersComponent} from './../components/admin-page/users/users.component'

import {MainmenuComponent} from './../components/admin-page/mainmenu/mainmenu.component'
import { ItemsPageComponent } from '../components/items-page/items-page.component'

import {SubmainmenuComponent } from './../components/admin-page/submainmenu/submainmenu.component'
import {ProductsComponent} from './../components/admin-page/products/products.component'
import {ItemsComponent} from './../components/admin-page/items/items.component'
import {PersonalInfoComponent} from './../components/admin-page/users/personalInfo.component'
import {EditUserComponent } from '../components/admin-page/users/editUser.component'
import {SessionEndComponent } from '../components/errorPage/sessionEnd.component'
import {ForbiddenComponent} from '../components/errorPage/forbidden.component'
import { ErrorAlertComponent } from '../components/errorPage/error-alert.component'
import {MaterialModule} from './material.module'


import {AppRoutingModule} from './app-routing.module'

import {AutocompleteLibModule} from 'angular-ng-autocomplete'

import {AuthDirective} from './../directives/auth.directive'
import { MustMatchDirective } from '../directives/must-match.directive'

import {JwPaginationComponent}  from './../components/templates/jwt-pagination/jwt-pagination-component'
import { BasketDetailComponent } from '../components/basketDetail/basketDetail-component';
import { ItemDetailComponent } from '../components/itemDetail/item-detail.component';
import { MyWhishListComponent } from '../components/myWhishlist/mywhishlist.component';
import { SearchPageComponent } from '../components/search-page/search-page.component';
import { CheckOut1Component } from '../components/checkout/checkout1.component';
import { CheckOut2Component } from '../components/checkout/checkout2.component';
import { CheckOut3Component } from '../components/checkout/checkout3.component';
import { CheckOut4Component } from '../components/checkout/checkout4.component';
import { MyOrdersComponent } from '../components/admin-page/users/myOrders.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [MainmenuComponent,
                 HeaderComponent,
                 FooterComponent,
                 MainPageComponent,
                 ItemsPageComponent,
                 HomeComponent,
                 UsersComponent,
                 SubmainmenuComponent,
                 ProductsComponent,
                 ItemsComponent,
                 AdminComponent,
                 TableTemplateComponent,
                 MainMenuTemplateComponent,
                 RegisterComponent,
                 PersonalInfoComponent,
                 EditUserComponent,
                 SessionEndComponent,
                 ForbiddenComponent,
                 ErrorAlertComponent,
                 AuthDirective,
                 MustMatchDirective,
                 JwPaginationComponent,
                 BasketDetailComponent,
                 ItemDetailComponent,
                 MyWhishListComponent,
                 SearchPageComponent,
                 CheckOut1Component,
                 CheckOut2Component,
                 CheckOut3Component,
                 CheckOut4Component,
                 MyOrdersComponent
                
                
               ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
     NgbModule 

  ],
  exports:[MainmenuComponent,
    HeaderComponent,
    FooterComponent,
    MainPageComponent
           
          ]

})
export class AppComponentsModule { }
