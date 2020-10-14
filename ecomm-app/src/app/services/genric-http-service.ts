import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs'
import { Injectable, OnInit , } from '@angular/core';
import { AppConstants } from '../constants/app-constants';

@Injectable()
export class GenericHttpService<T> implements OnInit {
	public url :string;
	public requestType:string;
	private header : HttpHeaders 
	constructor(
		public httpClient: HttpClient,
		
		) {
        //  console.log(this.requestType)
			
		//	this.url = AppConstants.baseUrl
		}
	ngOnInit(): void {
	 
	}

	  public create(endpoint :string,item: T ): Observable<T> {
		this.header = new HttpHeaders({'Request-Type':this.requestType ,'Content-Type':'application/json'})   
	
		return this.httpClient.post<T>(`${this.url}/${endpoint}`, item ,{headers: this.header} );
	  }
	  public createAny(endpoint :string,item: any ): Observable<any> {
		this.header = new HttpHeaders({'Request-Type':this.requestType ,'Content-Type':'application/json'})   
	
		return this.httpClient.post<any>(`${this.url}/${endpoint}`, item ,{headers: this.header} );
	  }
	  public createwithFile(endpoint :string,data: FormData ): Observable<T> {
		this.header = new HttpHeaders({'Request-Type':this.requestType })   
	//	this.header.append("Content-Type","multipart/form-data")
	    return this.httpClient.post<T>(`${this.url}/${endpoint}`, data ,{headers: this.header} );
	  }
/*
/*
	  public update(item: T): Observable<T> {
		return this.httpClient.put<T>(`${this.url}/${this.endpoint}/${item.id}`, item);
	  }*/

	  getById(endpoint:string ,id: any): Observable<T> {
		this.header = new HttpHeaders({'Request-Type':this.requestType}) 
		return this.httpClient.get<T>(`${this.url}/${endpoint}/${id}`, {headers: this.header});
	  }

	  getAll(endpoint:string): Observable<T[]> {
		this.header = new HttpHeaders({'Request-Type':this.requestType}) 
		 return this.httpClient.get<T[]>(`${this.url}/${endpoint}` ,{headers : this.header} );
	  }
	  getAllAny(endpoint:string):Observable<any>{
		this.header = new HttpHeaders({'Request-Type':this.requestType}) 
		return this.httpClient.get<any>(`${this.url}/${endpoint}` ,{headers : this.header} );
	 }
	  
	  getAllById(endpoint:string ,id : number): Observable<T[]> {
		this.header = new HttpHeaders({'Request-Type':this.requestType}) 
		return this.httpClient.get<T[]>(`${this.url}/${endpoint}/${id}` ,{headers : this.header} );
	  }
	  deleteById(endpoint:string,id: number) {
	/*	  let httpParams = new HttpParams().set('id',id.toString())
		  let options = {params : httpParams}*/
		this.header = new HttpHeaders({'Request-Type':this.requestType}) 
	    return	this.httpClient.request('delete',`${this.url}/${endpoint}`,{ body:id })
		//  return this.httpClient.delete(`${this.url}/${endpoint}`,options);

	  }


	    public toFormData<T>(formValue:T){
		  const formData = new FormData();
 
		  for(const key of Object.keys(formValue)){
			
          
			  const value = formValue[key];
			  formData.append(key,value);
			 
		  }
		
		  return formData;
	  }
}