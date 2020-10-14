import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import {MainmenuService,mainmenu,SubMainmenuService,submainmenu,ProductsService,products, ItemsService, Items, ItemImages,KeyTable ,KeyTableService} from './../../../services'

import { AppConstants, ErrorParse } from 'src/app/constants/app-constants';
import { FormBuilder ,FormGroup, Validators} from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {MyFilterPipe} from './../../../Pipes/my-filter.pipe';
import { Observable } from 'rxjs'
import { ParseError } from '@angular/compiler';
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  providers:[MyFilterPipe]
})
export class ItemsComponent implements OnInit {
  itemForm : FormGroup;

  query=""
  buttonLabelName ="" // this is for button on insert or update
  confirmDelete :boolean[] = [];
  isWorking :boolean;
  isloading :boolean;
  isSearching:boolean;
  isInserting :boolean;
  islist:boolean;
  


  isImageChanged = false;
  isListImagechanged = false;

  errMessage :{ 'errCode':number, 'errList':any[]};
  errValidation = [];

  imagesRootPath = "";
  imgUrl : ArrayBuffer | string ="./../../../../assets/img/noImage.png"; // for displaying image
  imagesList: ItemImages[] = []; // for displaying list 
  favoriteImage : any; // for sending to api 
  images : {'name':string ,'file':File}[] =[];  // for sending to api


  mainMenuList :{id:number, name:string , dis:boolean}[];
  subMainMenuList :{id:number, name:string , dis:boolean}[];
  productList : {id:number, name:string }[];
  itemsList : Items[];
  itemsListDisplay : Items[] ; // this is for filter  

  

  categoryList:KeyTable[];
  brandList   :KeyTable[];
  sizeList    :KeyTable[];

  
  selectedMainMenu :number;
  selectedTextMainMenu :string ='';
  selectedSubMainMenu:number;
  selectedTextSubMainMenu :string ='';
  selectedProduct :number;
  selectedTextProduct:string ='';
  ItemsCount:number = 0 ;

  //validation parameters 
   submitted =false ;
  

  constructor(private fb:FormBuilder,
            
              private mService : MainmenuService ,
              private sService : SubMainmenuService,
              private pService : ProductsService,
              private iService : ItemsService,
              private keyService :KeyTableService,
              private titleCasePipe:TitleCasePipe,
              private searchFilter :MyFilterPipe,
              private http :HttpClient) {
                this.getMainMenuList();
                this.islist = true;
                this.imagesRootPath=AppConstants.imagesRootPath;
                console.log(this.selectedSubMainMenu)
              }
    ngOnInit() {  
                this.itemForm = this.fb.group({
                  id :'0',
                  itemName :['',Validators.required],
                  itemLongName : '',
                  itemCode :['',Validators.required],
                  show :'true',
                  qty :['',Validators.required],
                  price:['',Validators.required],
                  discount :'',
                  itemDetails:'',
                  category:['',Validators.required],
                  brand :['',Validators.required],
                  size : ['',Validators.required],
                  productColor:'#000000'
              
              
                 }
                 ); 
                 
                 
              
            
              }
 //filter search
 dofilter(){
   this.itemsListDisplay = Object.assign([],this.itemsList)
   this.itemsListDisplay = this.searchFilter.transform(this.itemsList,'itemName,qty,price,discount',this.query)  
 
 }

  //load menulist -submenulist - products -items from the server 
  getMainMenuList() :void {
    this.isWorking = true;
    this.mService.getAll(AppConstants.getApiPath(1,"get"))
    .pipe(
      map(result =>{
        return result.map(x=> ({id: x.id ,name : x.mainMenuName, dis: (x.subMainMenu.length==0)?true:false }))

      }))
    .subscribe(result =>{
     this.mainMenuList = result;
      this.isWorking= false;
    },
    err=>{
      this.errMessage =err.message;
      this.isWorking =false;
    })
  }
  getSubMainMenuList($event) :void {
    this.subMainMenuList =[]
    this.selectedTextSubMainMenu ='';
    this.productList=[]
    this.selectedTextProduct='';

    this.selectedTextMainMenu=$event.target.options[$event.target.options.selectedIndex].text;
    this.isloading= true;
    this.sService.getAll(`${AppConstants.getApiPath(2,"get")}/${this.selectedMainMenu}`)
    .pipe(
      map(result => result.map(x=> ({id: x.id ,name :x.subMainMenuName ,dis:(x.products.length==0)?true:false})))
      )
      .subscribe(result =>{
        this.isloading=false;
        this.subMainMenuList = result;
      
      },
      err=>{
        this.errMessage =err.message;
        this.isloading=false;
      })
  }
  getProduct($event) :void{
    this.productList=[];
    this.selectedTextProduct='';
    this.selectedTextSubMainMenu=$event.target.options[$event.target.options.selectedIndex].text;
    this.isloading =true;
    this.pService.getAll(`${AppConstants.getApiPath(3,"get")}/${this.selectedSubMainMenu}`)
    .pipe(
      map(result =>result.map(x=>({id :x.id ,name:x.productName})))
    )
    .subscribe(result =>{
      this.isloading =false;
      this.productList = result;
    },
    err=>{
      this.errMessage = err.message;
      this.isloading=false;
    })
  }
  getItems() :void{
  
   this.errMessage = null;
   this.isSearching = true;
   this.iService.getAll(`${AppConstants.getApiPath(4,"get")}/${this.selectedProduct}`)
   
   .subscribe(result=>{
     this.isSearching=false;
     this.itemsList = result;
     this.itemsList= this.itemsList.sort((a,b)=>(a.id>b.id)?-1:1)
     this.itemsListDisplay  = Object.assign([],this.itemsList)
     this.ItemsCount = this.itemsListDisplay.length; 
     },
    err=>{
      this.isSearching=false;
      this.errMessage =ErrorParse(err);
    }
   )
  }

  // select item to update 
getItem(id :number){
  this.errMessage = null;
  this.iService.getById(AppConstants.getApiPath(4,"getItem"),id)
  .subscribe(
    result => {
     
     this.setFormValue(result);
     this.swichTo('Update');

    },
    err => this.errMessage = err.message
  )
}

setFormValue( result :Items){

  this.favoriteImage = result[0].favoriteImage;
  this.itemForm.setValue(
  { id :result[0].id,
    itemName : result[0].itemName, 
    itemLongName : result[0].itemLongName,
    itemCode : result[0].itemCode,
    show : result[0].show,
    qty : result[0].qty,
    price: result[0].price,
    discount: result[0].discount,
    itemDetails: result[0].itemDetails,
    category: result[0].category.categoryName,
    brand: result[0].brand.brandName,
    size: result[0].size.sizeName,
    productColor: result[0].productColor.colorName
    
   }
  
 )
 // fill the main image
 var  imgToDisplay = (result[0].itemPicturePath == '')?'./../../../../assets/img/noImage.png':`${AppConstants.imagesRootPath}/${result[0].itemPicturePath}`
 this.imgUrl = `${imgToDisplay}`;
 // fill the addional images
 if(result[0].images != null){
  for(var i = 0 ; i < result[0].images.length; i++){
    let img = result[0].images[i];
   let imgName = `${img.imagePath}`.split(`${result[0].id}/`)
   
    this.imagesList.push({
       'id':img.id,
       'imagePath' :  `${AppConstants.imagesRootPath}/${img.imagePath}`,
       'itemId':img.itemId,
       'imageName' : imgName[1],
       'newImage':''

    })
  }
 }

}
  //switch page between List and Insert and Update
  swichTo(page:string){
    if (page == 'List'){
      this.islist = true;
      this.clearFields();
      this.getItems();
    }
    else{
      this.islist= false;
      this.getkeyTables();
     this.buttonLabelName =(page=="Insert")?"Add new item" :"Update item"
    }

  }
  // get brand category size table to display it in insert form
  getkeyTables():void{
    let model : KeyTable[];
    this.keyService.getAll(AppConstants.getApiPath(4,'getkeys'))
    .subscribe( result => {
    //  model = result;
      this.categoryList = result.filter(c=>c.tableName =='Categories');
    
      this.brandList = result.filter(b=>b.tableName == 'Brands')
      this.sizeList = result.filter(s=>s.tableName == 'Sizes')
    },
    err =>{
      this.errMessage = err.message;
    })
   
  }
  
  onProductChange($event){
    this.selectedTextProduct=$event.target.options[$event.target.options.selectedIndex].text;
  }



   // submit the data to the server            
   onSubmit(){
              
    this.submitted = true;
    if(this.itemForm.invalid){
      //this.errMessage = {'errCode':0, 'errList':[]}
      this.errMessage  = null;
      this.errValidation = [];
      
      if(this.itemForm.controls['category'].invalid){
         this.errValidation.push(" Category field is required ")}
       if(this.itemForm.controls['brand'].invalid){
        this.errValidation.push(" Brand field is required ")}
       if(this.itemForm.controls['size'].invalid) {
          this.errValidation.push(" Size field is required ")
       }   

      this.errMessage ={ 'errCode':1004 ,'errList': this.errValidation}
       
    }
    else{
      // check discount if null set it to 0
      const  discountVal = (this.itemForm.controls['discount'].value=="")?"0": this.itemForm.controls['discount'].value
      this.itemForm.patchValue({'itemName': (""+this.itemForm.controls['itemName'].value).toUpperCase(), 'discount' : discountVal  ,'productColor':this.itemForm.controls['productColor'].value})
    
     
      // start enter the data here 
      let imagesl = this.images.map(x=>x.file);
      
     
      let dataTosubmit = {...this.itemForm.value,'favoriteImage': this.favoriteImage }
      let formData = this.iService.toFormData(dataTosubmit);
      
       formData.append('productColor.ColorName',`${this.itemForm.get('productColor').value}`);
       formData.append('productsId',`${this.selectedProduct}`);
       formData.append('currencyId',`1`)
      // formData.append('discount',discountVal)
       formData.append('isImageChange' ,`${this.isImageChanged}`)
       formData.append('isListChange' ,`${this.isListImagechanged}`)
     
       //update old image
       if((typeof this.imgUrl =="string" && (<string>this.imgUrl).indexOf("noImage") == -1)){
          
           var path = this.imgUrl.split('/images')
          
           formData.append('ItemPicturePath',`images${path[1]}`)
         }
         else{
           formData.append('ItemPicturePath','')
         }
      
       // update old list images
       for(var i = 0 ; i< this.imagesList.length; i++){
          if(this.imagesList[i].id !=0)
          { formData.append(`images[${i}].imagePath`, this.imagesList[i].imagePath.replace(`${AppConstants.imagesRootPath}/`,''))
            formData.append(`images[${i}].itemId`,""+this.imagesList[i].itemId)
         
           }
         }
       
         //fill the list of new images in formData 
        for(var i =0 ; i< imagesl.length ;i++  ){
            formData.append('listOfImages' ,imagesl[i])
          }
         
        
      // category 
      if(typeof this.itemForm.controls['category'].value == "string"){
       
      var cat = this.categoryList.find(c=>c.name == this.itemForm.controls['category'].value)
       
       if(!!cat==false)//!!cat return false if it is undefind  result is undefind not found 
       {
         formData.append('category.Id','0')
         formData.append('category.CategoryName', this.titleCasePipe.transform(this.itemForm.controls['category'].value))
       }
       else{
        formData.append('categoryId', `${cat.id}`)  
       }
      }
      else{
    
        formData.append('categoryId', `${this.itemForm.controls['category'].value.id}`) 
      }
 
     
      // brand
      if(typeof this.itemForm.controls['brand'].value == "string"){
       
        var brnd = this.brandList.find(c=>c.name == this.itemForm.controls['brand'].value)
      
        if(!!brnd == false)//!!brnd return false if it is undefind  result is undefind not found 
       {
        formData.append('brand.Id','0')
        formData.append('brand.BrandName', this.titleCasePipe.transform(this.itemForm.controls['brand'].value))
       }
       else{
        formData.append('brandId', `${brnd.id}`)  
       }
      }else{
        formData.append('brandId', `${this.itemForm.controls['brand'].value.id}`) 
      }
     
      // size
      if(typeof this.itemForm.controls['size'].value == "string"){
       
        var sze = this.sizeList.find(c=>c.name == this.itemForm.controls['size'].value)
       if(!!sze ==false)//!!cat return false if it is undefind  result is undefind not found 
       {
        formData.append('size.Id','0')
        formData.append('size.SizeName', this.titleCasePipe.transform(this.itemForm.controls['size'].value))
       }
       else{
        formData.append('sizeId', `${sze.id}`)  
       }
      }else{
        formData.append('sizeId', `${this.itemForm.controls['size'].value.id}`) 
      }
     
     
        

      // continue here to save data using api
      this.isInserting=true;
      this.iService.createwithFile(AppConstants.getApiPath(4,"add"),formData)
      .subscribe(
        result=>{
          this.isInserting=false;
          this.swichTo('List');
          this.clearFields();
          this.getItems();
          console.log("item added successfully.")
        },
        err=>{
          this.isInserting=false;
          this.errMessage = ErrorParse(err);

       
        
        
        }
      )


    }
  // end of onsubmit()
  }
  //delete data 
  deleteItem(id:number){
    this.iService.deleteById(AppConstants.getApiPath(4,"delete"),id)
    .subscribe(result=>{
      this.getItems();
    },
    err=>{
      this.errMessage= err.message;
    })
  }
 //clear fields after inserting 
 clearFields(){
   
   this.submitted=false;
   this.clearImageItem();
   this.images = [];
   this.imagesList = [];
   this.errMessage=null;
   this.errValidation =[];
  // this.itemForm.reset();
   this.itemForm.controls['id'].setValue(0)

   this.itemForm.controls['itemName'].reset("")
   
   this.itemForm.controls['itemLongName'].setValue("")
   this.itemForm.controls['itemCode'].reset("")
  
   this.itemForm.controls['show'].setValue(true)
   this.itemForm.controls['qty'].reset("")
   this.itemForm.controls['price'].reset("")
   this.itemForm.controls['discount'].setValue("")
   this.itemForm.controls['category'].setValue("")
   this.itemForm.controls['brand'].setValue("")
   this.itemForm.controls['size'].setValue("")
   this.itemForm.controls['productColor'].setValue("#000000")
   this.itemForm.controls['itemDetails'].setValue("");
   this.isImageChanged = false ;
   this.isListImagechanged= false;
   this.imgUrl="./../../../../assets/img/noImage.png"
   this.itemForm.clearValidators;
  
 }
  // images section for one image and list images 
  addImage(files){
    if (files.length === 0)
    return;

  var mimeType = files[0].type;
  if (mimeType.match(/image\/*/) == null) {
    this.errValidation.push("Only images are supported.");
    return;
  }
  this.favoriteImage = files[0];
  var reader = new FileReader();
 // this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
    this.imgUrl = reader.result; 
    this.isImageChanged=true;
   
  }
}
  addImages(files){
        
    this.isListImagechanged = true;
        for(var i = 0  ; i < files.length ; i++){
           this.addImagesInImagesList(files[i]);
          }
         }
   
  addImagesInImagesList(file) {
    this.images.push({'name':file.name, 'file':file});
    let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (_event)=>{
       
        this.imagesList.push({ 'id':0 , 'imagePath' : '',  'itemId': 0 ,'newImage': reader.result , 'imageName': file.name})
        this.imagesList = this.imagesList.sort((a,b)=>(a.id>b.id)?1:-1)
  }
}
removeFromNewImagesList(name){
  this.isListImagechanged = true;
  // this list to display on  the screen
  var index = this.imagesList.findIndex(x=>x.imageName == name);
   this.imagesList.splice(index,1);

   // this list to send to api
  var indexInImages =  this.images.findIndex(x=>x.name==name);
   this.images.splice(indexInImages,1);
 
   
 }
removeFromExistingImagesList(name){
 this.isListImagechanged = true;
}
clearImageItem():void{
  this.imgUrl ="./../../../../assets/img/noImage.png";
  this.favoriteImage  = null;
  this.isImageChanged = true;
}
  // convenience getter for easy access to form fields
  get f() { return this.itemForm.controls; }
  // check the duplicate for item name
  checkItemName(name :string ,type:string){
    
    
     let itemNameInValid = !(this.itemsList.filter(result=> (""+result[type])==name.toUpperCase()).length ==0)
   
      if(itemNameInValid == true)
       {  
        this.f[type].setErrors({'nameExists' :itemNameInValid});
      //  this.f.itemName.setErrors({'nameExists' :itemNameInValid});
        
      }
      else{
          this.f[type].setErrors(null);
          this.f[type].updateValueAndValidity();
          //this.f.itemName.setErrors(null);
         // this.f.itemName.updateValueAndValidity();
      }   
      
  }
}
