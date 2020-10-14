using BusinessLayer.Genric;
using BusinessLayer.Genric.PagingOrderingSpecification;
using BusinessLayer.Genric.Specification;
using BusinessLayer.Interfaces;
using DAL;
using DAL.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Repositories
{
   public class ItemRepository : UnitOfWork<Items>, IItemRepository 
    {
        private readonly ApplicationDbContext db;
        private readonly IHostingEnvironment env;
        private readonly IUnitOfWork<Products> productRepo;
        private readonly IUnitOfWork<ItemImages> itemImagesRepo;
        private readonly IUnitOfWork<Category> cateogryRepo;
        private readonly IUnitOfWork<Brands> brandRepo;
        private readonly IUnitOfWork<ItemSize> sizeRepo;
        private readonly IUnitOfWork<ProductColor> colorRepo;
        private readonly IImageManaging imageManaging;
        private Expression<Func<Items, object>> OrderByCriteria;
        public ItemRepository(ApplicationDbContext db 
                             , IHostingEnvironment env
                             , IUnitOfWork<Products> productRepo
                             , IUnitOfWork<ItemImages> ItemImagesRepo
                             , IUnitOfWork<Category> CateogryRepo
                             , IUnitOfWork<Brands> BrandRepo
                             , IUnitOfWork<ItemSize> SizeRepo
                             , IUnitOfWork<ProductColor> ColorRepo
                             , IImageManaging imageManaging) :base(db) {
            this.db = db;
            this.env = env;
            this.productRepo = productRepo;
            itemImagesRepo = ItemImagesRepo;
            cateogryRepo = CateogryRepo;
            brandRepo = BrandRepo;
            sizeRepo = SizeRepo;
            colorRepo = ColorRepo;
            this.imageManaging = imageManaging;
        }

        public void AddItem(Items item, IFormFile favoriteImage, List<IFormFile> images ,bool isImageChange,bool isListChange)
        {
             var productName = productRepo.GetById(item.ProductsId).ProductName;
           
            if (item.Id == 0)
            {
                //check if color exists before add
                var colorObject = colorRepo.GetBy(c => c.ColorName == item.ProductColor.ColorName).FirstOrDefault();
                if (colorObject != null) item.ProductColor = colorObject;
               
                
                base.Insert(item);
                Save();
                if (favoriteImage != null && isImageChange)
                    item.ItemPicturePath = imageManaging.SaveImageToServer(favoriteImage, productName, item.Id);
                else if (favoriteImage == null && isImageChange)
                    item.ItemPicturePath = "";


               // new list Images always in Add new Item
                if(images?.Count != 0 && isListChange)
                {
                    var list = new List<ItemImages>();
                    foreach (var image in images)
                    {
                        var itemImage = new ItemImages
                        {
                            ImagePath = imageManaging.SaveImageToServer(image, productName, item.Id)
                        };
                        list.Add(itemImage);
                    }
                    item.Images = list;
                }
                Save();   
            }
            else
            {
               
                if (favoriteImage != null && isImageChange)
                    item.ItemPicturePath = imageManaging.SaveImageToServer(favoriteImage, productName, item.Id);
                else if(favoriteImage == null && isImageChange)
                    item.ItemPicturePath = "";

                if (item.ItemPicturePath == null) item.ItemPicturePath = "";
               
               // add new List Images in existing Item 
                if (images != null && isListChange)
                {
                    var list = new List<ItemImages>();
                    foreach (var image in images)
                    {
                        var itemImage = new ItemImages
                        {
                            ImagePath = imageManaging.SaveImageToServer(image, productName, item.Id)
                        };
                        if (item.Images == null) item.Images = new List<ItemImages>();
                        item.Images.Add(itemImage);
                    }
                   
                }

                UpdateData(item,isImageChange,isListChange);
                Save();
            }



            //Delete un-necessary images in the folder
            if (item.Images != null)
            {

                var ImagesToKeep = item.Images.Select(p => p.ImagePath).ToList();
                //add the favorite image to keep it in table items 
                if (!string.IsNullOrEmpty(item.ItemPicturePath))
                    ImagesToKeep.Add(item.ItemPicturePath);

                imageManaging.DeleteImageFromServer(ImagesToKeep, productName, item.Id);
            }
            else 
            {
                var ImagesToKeep = new List<string>();
                if (string.IsNullOrEmpty(item.ItemPicturePath))
                    ImagesToKeep = null;
                else
                    ImagesToKeep.Add(item.ItemPicturePath);
              
                imageManaging.DeleteImageFromServer(ImagesToKeep, productName, item.Id);
            }
          
        }

        public  void UpdateData(Items obj ,bool isImageChanged ,bool isListChanged)
        {
           
           
            var strategy = db.Database.CreateExecutionStrategy();
            strategy.Execute(() =>
            {
            using (var transaction = db.Database.BeginTransaction())
            {
               
                    try
                    {
                      //  var item = db.Items.Where(i => i.Id == obj.Id).FirstOrDefault();
                     
                       // if old list images changed then do this
                       
                       var imageItems = db.ItemImages.Where(i => i.ItemId == obj.Id);
                        if (isListChanged)
                        {
                            db.ItemImages.RemoveRange(imageItems);
                            db.SaveChanges();

                            if (obj.Images != null)
                            {
                                foreach (var img in obj.Images)
                                {
                                    img.ItemId = obj.Id;
                                    db.ItemImages.Add(img);
                                }
                            }
                            db.SaveChanges();
                        }else
                        {
                            obj.Images = imageItems.ToList();
                        }
                        

                        /*
                        db.Attach(obj);
                        
                        if (!isImageChanged)
                        db.Entry(obj).Property(x => x.ItemPicturePath).EntityEntry.State = EntityState.Unchanged;

                        db.Entry(obj).State = EntityState.Modified;
                        var entry = db.ChangeTracker.Entries();
                        */
                        
                       //add category if not exists 
                       if(obj.Category != null)
                        {
                            var categoryCheck = db.Categories.Where(c => c.CategoryName == obj.Category.CategoryName).FirstOrDefault();
                            if (categoryCheck == null)
                            {
                                db.Categories.Add(obj.Category);
                                db.SaveChanges();
                            }
                        }
                       // add size if not exists 
                       if(obj.Size != null)
                        {
                            var sizeCheck = db.Size.Where(s => s.SizeName == obj.Size.SizeName).FirstOrDefault();
                            if (sizeCheck != null)
                            {
                                db.Size.Add(obj.Size);
                                db.SaveChanges();
                            }
                        }
                        // Check the color if exists 
                        if (obj.ProductColor != null)
                        {
                            var colorCheck = db.ProductColor.Where(c => c.ColorName == obj.ProductColor.ColorName).FirstOrDefault();
                             if (colorCheck != null)
                            {
                                obj.ProductColorId = colorCheck.Id;
                                obj.ProductColor = null;
                            }
                            else
                            {
                                db.ProductColor.Add(obj.ProductColor);
                                db.SaveChanges();
                            }
                            
                        }
                        // add brands if not exists 
                        if(obj.Brand != null)
                        {
                            var brandCheck = db.Brands.Where(b => b.BrandName == obj.Brand.BrandName).FirstOrDefault();
                            if (brandCheck == null)
                            {
                                db.Brands.Add(obj.Brand);
                                db.SaveChanges();
                            }

                        }

                        db.Update(obj);
                      
                        db.SaveChanges();
                        transaction.Commit();
                    }
                    catch (Exception ex)
                    {

                        transaction.Rollback();
                        throw ex;
                    }
                }
            });
                
           

        }

        public override void Delete(object id)
        {
            var item = this.GetBy(i=>i.Id == (int)id).Include(p=>p.Products).FirstOrDefault();


            imageManaging.DeleteAllImagesFromFolder(item.Products.ProductName, item.Id);
            base.Delete(id);
          
        }
        /*
        private string SaveImageToServer(IFormFile file, string ProductName, int ItemId)
        {
            var ImageName = Path.GetFileName(file.FileName);//getting only file name (ex-ganesh.jpg) 
            var ext = Path.GetExtension(file.FileName); //getting the extension(ex-.jpg)  
            string ImageNameWithoutExtension = Path.GetFileNameWithoutExtension(ImageName); //getting Image name without extension


            var webRoot = env.WebRootPath;
            var ImageFullName = ImageNameWithoutExtension + ext;

            //Check if the folder containing the product images exists on server
            var directory = Path.Combine(webRoot, $"images\\Products\\{ProductName}\\{ItemId}");

            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            var path = Path.Combine(webRoot, $"images\\Products\\{ProductName}\\{ItemId}\\{ImageFullName}");

            //Check if image exists on folder - if yes delete it
            if (File.Exists(path))
            {
                File.Delete(path);
            }

            var stream = new FileStream(path, FileMode.Create);
            file.CopyTo(stream);
            return $"images\\Products\\{ProductName}\\{ItemId}\\{ImageFullName}";

        }
       
        private void DeleteImageFromServer(List<string> ImagesName, string ProductName, int ItemId)
        {
            var webRoot = env.WebRootPath;
            var directory = Path.Combine(webRoot, $"images/Products/{ProductName}/{ItemId}");


            for (var i = 0; i < ImagesName.Count; i++)
            {
                string[] str = ImagesName[i].Split($"{ItemId}\\");
                ImagesName[i] = str[1];
            }
           
            DirectoryInfo folderInfo = new DirectoryInfo(directory);
            foreach (FileInfo file in folderInfo.GetFiles())
            {
                if ( ImagesName.IndexOf(file.Name) == -1)
                {
                    file.Delete();
                }
            }
        }
        */
        private void DeleteAllImagesFromFolder(string ProductName, int ItemId)
        {
            var webRoot = env.WebRootPath;
            var directory = Path.Combine(webRoot, $"images/Products/{ProductName}/{ItemId}");

            if (!Directory.Exists(directory))
                return;

            DirectoryInfo folderInfo = new DirectoryInfo(directory);

            foreach (FileInfo file in folderInfo.GetFiles())
                file.Delete();
        }












        //Not  important 
        public IEnumerable<Items> ListAll(int ProductId, int? ItemId, ItemsOrder OrderBy, OrderByEnum OrderByType)
        {
            

            OrderByCriteria = (OrderBy == ItemsOrder.ItemName) ? (Expression<Func<Items, object>>)(I => I.ItemName) : (I => I.Price);
            var spec = new ItemsSpecification(ProductId, ItemId, OrderByCriteria, OrderByType);

            return SpecificationEvaluation<Items>.GetQuery(db.Items, spec);
        }

        public IEnumerable<Items> ListAll(int? ProductId,
                                                 int? ItemId,
                                                 int? CategoryId ,
                                                 string BrandId,
                                                 string ProductColorId,
                                                 string SizeId,
                                                 int? skip, int? take, ItemsOrder OrderBy, OrderByEnum OrderByType)
        {
            OrderByCriteria = (OrderBy == ItemsOrder.ItemName) ? (Expression<Func<Items, object>>)(I => I.ItemName) : (I => I.Price);



            List<int> listofBrands = null;
            List<int> listofProductColors = null;
            List<int> listofSizes = null;
            if (!string.IsNullOrEmpty(BrandId))
                listofBrands = BrandId.Split(",").Select(int.Parse).ToList();

            if (!string.IsNullOrEmpty(ProductColorId))
                listofProductColors = ProductColorId.Split(",").Select(int.Parse).ToList();

            if (!string.IsNullOrEmpty(SizeId))
                listofSizes = SizeId.Split(",").Select(int.Parse).ToList();

           
            var spec = new ItemsPaginatedSpecification(ProductId,ItemId, CategoryId, skip, take, OrderByCriteria, OrderByType, listofBrands, listofProductColors, listofSizes);

            return SpecificationEvaluation<Items>.GetQuery(db.Items, spec);
        }

        public  IEnumerable<KeyTables> GetKeyTables()
        {
            var model =  cateogryRepo.GetAll().Select(c=> new KeyTables { Id = c.Id, Name = c.CategoryName, TableName = "Categories" });

            var brndModel = brandRepo.GetAll().Select(b => new KeyTables { Id = b.Id, Name = b.BrandName, TableName = "Brands" });

            model = model.Union(brndModel);

            var sizemodel =  sizeRepo.GetAll().Select(s => new KeyTables { Id = s.Id, Name = s.SizeName, TableName = "Sizes" });
            model = model.Union(sizemodel);
            return  model;


        }





        /*
                public void SaveImageToServer(IFormFile file ,string filePath ,string ProductName ,int ItemId)
                {
                    var ImageName = Path.GetFileName(file.FileName);//getting only file name (ex-ganesh.jpg) 
                    var ext = Path.GetExtension(file.FileName); //getting the extension(ex-.jpg)  
                    string ImageNameWithoutExtension = Path.GetFileNameWithoutExtension(ImageName); //getting Image name without extension


                    var webRoot = env.WebRootPath;
                    var ImageFullName = ImageNameWithoutExtension + ext;

                    //Check if the folder containing the product images exists on server
                    var directory = Path.Combine(webRoot, $"images/Products/{ProductName}/{ItemId}");

                    if (!Directory.Exists(directory))
                        Directory.CreateDirectory(directory);

                    var path = Path.Combine(webRoot, $"images/Products/{ProductName}/{ItemId}/{ImageFullName}");

                    //Check if image exists on folder - if yes delete it
                    if(File.Exists(path))
                    {
                        File.Delete(path);
                    }

                    var stream = new FileStream(path, FileMode.Create);
                    file.CopyTo(stream);

                }

                public void DeleteImageFromServer(string ImageName ,string ProductName, int ItemId)
                {
                    var webRoot = env.WebRootPath;
                    var directory = Path.Combine(webRoot, $"images/Products/{ProductName}/{ItemId}");

                    DirectoryInfo folderInfo = new DirectoryInfo(directory);
                    foreach(FileInfo file in folderInfo.GetFiles())
                    {
                        if(file.Name == ImageName)
                        {
                            file.Delete();
                        }
                    }
                }

                public void DeleteAllImagesFromFolder(string ProductName ,int ItemId)
                {
                    var webRoot = env.WebRootPath;
                    var directory = Path.Combine(webRoot, $"images/Products/{ProductName}/{ItemId}");
                    DirectoryInfo folderInfo = new DirectoryInfo(directory);

                    foreach (FileInfo file in folderInfo.GetFiles())
                        file.Delete();
                }*/

    }
}
