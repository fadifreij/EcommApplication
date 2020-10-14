

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import {  RouterModule } from '@angular/router';

import { AppRoutingModule } from './modules/app-routing.module';
import {AppComponentsModule} from './modules/app-components.module'


import { AppComponent } from './app.component';


import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { MaterialModule} from './modules/material.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ng-autocomplete
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
//dialogs
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
//import {DialogMainMenu} from './components/admin-page/mainmenu/mainmenu.component'

import {DialogTemplateComponent} from './components/templates/table-template/table-template.component'
//services
import {GenericHttpService , MainmenuService ,SubMainmenuService ,
        ProductsService,  ItemsService  ,HttpSecureService,HttpService ,
        KeyTableService,UsersService, AdminUserService, UserListResolverService, RefreshTokenService} from './services';

import { TitleCasePipe } from '@angular/common';
import { MyFilterPipe } from './../app/Pipes/my-filter.pipe';
import { AddTokenInterceptor } from './Interceptor/addTokenInterceptor';
import { AdminStaffGuardService } from './Guards/adminStaff.guards';
import { LoadingService } from './services/loading-service';
import { BasketService } from './services/basket.service';
import {  RoutingStateService } from './services/routingState.service';
import { CheckOutGuardService } from './Guards/checkout.guard';
import { AuthGuardService } from './Guards/auth.guard';

import {HashLocationStrategy,LocationStrategy} from '@angular/common'


@NgModule({
  declarations: [
    AppComponent,
    MyFilterPipe,
  
    
   
   
   
   // DialogMainMenu,
    
    DialogTemplateComponent
    
   
   
    
    
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    AppComponentsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    AutocompleteLibModule
    
    
   
  ],
  entryComponents: [
  
    DialogTemplateComponent
  ],
  providers: [
    GenericHttpService,
    HttpSecureService,
    HttpService,
    MainmenuService,
    SubMainmenuService,
    ProductsService,
    ItemsService,
    KeyTableService,
    UsersService,
    TitleCasePipe,
    AdminUserService,
    RefreshTokenService,
    UserListResolverService ,
    AdminStaffGuardService,
    CheckOutGuardService,
    AuthGuardService,
    LoadingService,
    BasketService,
    RoutingStateService,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false }},
    {provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi:true},
    {provide:LocationStrategy,useClass:HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
