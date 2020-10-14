import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export class AppConstants{
  
    public static cookieTokenName :string ="eShopCookie"
    public static cookieRefreshName : string ="refreshToken"
    public static cookieBasketItems : string ="basketCookie"
    public static deliveryPrice :number = 10;
    public static baseUrl = "http://localhost:54801";
    public static imagesRootPath= "http://localhost:54801"
    public static apiEndPointMainMenu : {'type' : string ,'path':string}[] =[
        {'type' : 'add' ,'path' : '/api/MainMenu/Add'},
        {'type' : 'get' ,'path' : '/api/MainMenu/GetAll'},
        {'type' : 'delete' ,'path' : '/api/MainMenu/Delete'}];
   
    public static apiEndPointSubMainMenu : {'type' : string ,'path':string}[] =[
        {'type' : 'add' ,'path' : '/api/SubMainMenu/Add'},
        {'type' : 'get' ,'path' : '/api/SubMainMenu/GetAll'},
        {'type' : 'delete' ,'path' : '/api/SubMainMenu/Delete'},
        {'type' : 'getActive' ,'path' : '/api/MainMenu/GetAllActive'}
    ]; 

    public static apiEndPointProducts : {'type' : string ,'path':string}[] =[
         {'type' : 'add' ,'path' : '/api/Products/Add'},
         {'type' : 'get' ,'path' : '/api/Products/GetAll'},
         {'type' : 'delete' ,'path' : '/api/Products/Delete'},
         {'type' : 'getItems','path': '/api/Products/GetItemsForProduct' },
         ]; 
    
    public static apiEndPointItems : {'type' : string , 'path':string}[]=[
        {'type' : 'add' ,   'path' : '/api/Items/Add'},
        {'type' : 'get' ,   'path' : '/api/Items/GetAll'},
        {'type' : 'getkeys','path' : '/api/Items/GetKeyTables'},
        {'type' : 'getItem', 'path'  : 'api/Items/GetItem' },
        {'type' :'getItemByPId', 'path':'api/Items/GetItemByPId'},
        {'type' : 'delete' , 'path'  : 'api/Items/Delete'},
        {'type' : 'getLike', 'path':'api/Items/GetAllLike'}
        
    ];
    static apiEndPointAccount  : {'type':string , 'path':string}[] =[
        {'type' :'register', 'path' :'/api/Account/Register'},
        {'type' :'login', 'path' :'/api/Account/Login'},
        {'type' :'logout', 'path' :'/api/Account/Logout'},
        {'type' :'refresh', 'path' :'/api/Account/refresh-token'},
        {'type' :'reset','path':'/api/Account/ResetPassword'},
        {'type' : 'updateName' , 'path' :'/api/Account/UpdateName'},
        {'type': 'getName','path':'/api/Account/GetName'}

       
    ];
    static apiEndPointAdministration :{ 'type':string , 'path':string}[] =[
        {'type' :'listall','path':'/api/Administration/ListUsers'},
        {'type' :'getUser','path':'/api/Administration/GetUser'},
        {'type' :'editRole','path':'/api/Administration/EditUserRoles'}
    ]
  
    static apiEndpointBasket : {'type':string, 'path':string}[]=[
        {'type' : 'getBasket'    ,'path':'/api/Basket/GetBasket'},
        {'type' : 'addBasket'    ,'path':'/api/Basket/Save'},
        {'type' : 'deleteBasket' ,'path':'/api/Basket/Delete'}
    ]
    static apiEndpointCheckout :{'type':string , 'path':string}[]=[
        {'type':'checkout' ,'path':'/api/CheckOut'},
        {'type':'maxSlot' , 'path':'/api/CheckOut/FullSlot'},
        {'type':'getOrders','path':'/api/Order/GetOrders'}
    ]
   public  static getApiPath (modelnumber:number ,type:string)  :string  {
       if(modelnumber ==1) 
       return AppConstants.apiEndPointMainMenu.find(x=>x.type ==type).path;

       if(modelnumber==2)
       return AppConstants.apiEndPointSubMainMenu.find(x=>x.type==type).path;

       if(modelnumber==3)
       return AppConstants.apiEndPointProducts.find(x=>x.type==type).path;

       if(modelnumber==4)
        return AppConstants.apiEndPointItems.find(x=>x.type==type).path;
   }
   
   public static getApiPathByName(modelname :string , type):string{
    
  
    let result :string = ""
    if(modelname ==="account")
     return AppConstants.apiEndPointAccount.find(x=>x.type==type).path;
  
     if(modelname ==="admin")
     return AppConstants.apiEndPointAdministration.find(x=>x.type==type).path;
 
     if(modelname==="basket")
     return AppConstants.apiEndpointBasket.find(x=>x.type===type).path;

     if(modelname==="order")
     return AppConstants.apiEndpointCheckout.find(x=>x.type===type).path;
     return result;
   }
}

/**
 * This functions is for controlling errors  in all projects 
 */

export function ErrorParse(err : HttpErrorResponse){
 var errorList  = [] ;
 var errorCode  = err.status;
 
if(err.error ==null){
    errorList.push(err.statusText)
    return {'errCode': errorCode , 'errList' : errorList}; 
}
 if(typeof(err.error) == "string")
  {
        errorList.push(err.error);
    }
if(err.error.hasOwnProperty('errors')){
   let errVal  = err.error.errors;
   
   // check if this property is string
   if(typeof(errVal)=="string"){
       errorList.push(errVal);
     }
   
   
   // check if this property is object
    checkIfObject(errVal, errorList)
  
  
 }

 return {'errCode': errorCode , 'errList' : errorList};
}


function checkIfObject(obj  , list){
    if(obj instanceof Object){
       
        Object.keys(obj).forEach((key,index)=>{
            if(obj[key] instanceof Object)
              checkIfObject(obj[key],list)
            if( typeof(obj[key]) == "string")
              list.push(obj[key])
        })
       
    }
  
}




