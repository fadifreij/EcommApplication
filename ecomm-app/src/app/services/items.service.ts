
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpSecureService } from './http-secure-service';
import { products } from '.';


@Injectable({
    providedIn: 'root'
  })
export class ItemsService extends  HttpSecureService<Items> {
 
    constructor(public httpClient : HttpClient) { 
      super(httpClient);
            
       } 
  /*
  getKeyTables() : Observable<KeyTable[]> {
      return this.httpClient.get<KeyTable[]>(AppConstants.getApiPath(4,'getkeys'))
    }
  */
  }
  
  export class Items{
    id:number;
    itemName:string;
    itemLongName :string;
    show : boolean;
    itemCode :string;
    qty :number ;
    discount : number;
    price:number;
    itemDetails :string;
    productId :number;
    currencyId :number;
    categoryId :number;
    brandId:number;
    itemPicturePath:string;
    productColorId:number;
    sizeId :number;
    images :ItemImages[];
    products : products;
    category :{categoryName :string , id :number};
    brand :{brandName:string ,id:number};
    productColor:{colorName :string ,id:number};
    size:{sizeName:string ,id:number};
    isWhishList? :boolean;
    pId :string;
  }
  export class ItemImages{
      id :number;
      imagePath :string;
      itemId :number;
      newImage :any;
      imageName :string;
  }

  