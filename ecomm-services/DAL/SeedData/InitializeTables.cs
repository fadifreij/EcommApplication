using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.SeedData
{
   public static class InitializeTables
    {
        public static void Seed(ModelBuilder model)
        {
            /* Seed MainMenu Table */
            model.Entity<MainMenu>().HasData(new MainMenu { Id =1, MainMenuName = "Women" , WhenAdded= DateTime.Now ,Show = true });
          

            /* Seed SubMainMenu Table */
            model.Entity<SubMainMenu>().HasData(new SubMainMenu { Id = 1, MainMenuId = 1, SubMainMenuName = "Clothing", WhenAdded = DateTime.Now, Show = true });
          



            /* Seed Products Table */
            model.Entity<Products>().HasData(new Products { Id = 1, ProductName = "Dresses", WhenAdded = DateTime.Now, Show = true, SubMainMenuId = 1 });
            model.Entity<Products>().HasData(new Products { Id = 2, ProductName = "Coats", WhenAdded = DateTime.Now, Show = true, SubMainMenuId = 1 });
            model.Entity<Products>().HasData(new Products { Id = 3, ProductName = "Jackets", WhenAdded = DateTime.Now, Show = true, SubMainMenuId = 1 });

            /* Seed Category Table */
            model.Entity<Category>().HasData(new Category { Id = 1, CategoryName = "Party Dresses", WhenAdded = DateTime.Now });
            model.Entity<Category>().HasData(new Category { Id = 2, CategoryName = "Day Dresses" , WhenAdded = DateTime.Now });
            model.Entity<Category>().HasData(new Category { Id = 3, CategoryName = "Evening Dresses",  WhenAdded = DateTime.Now });

            model.Entity<Category>().HasData(new Category { Id = 4, CategoryName = "Capes",  WhenAdded = DateTime.Now });
            model.Entity<Category>().HasData(new Category { Id = 5, CategoryName = "Long Coats",  WhenAdded = DateTime.Now });
            model.Entity<Category>().HasData(new Category { Id = 6, CategoryName = "Parkas",  WhenAdded = DateTime.Now });
            model.Entity<Category>().HasData(new Category { Id = 7, CategoryName = "Quilted Coats",  WhenAdded = DateTime.Now });

            model.Entity<Category>().HasData(new Category { Id = 8, CategoryName = "Biker Jacket",  WhenAdded = DateTime.Now });
            model.Entity<Category>().HasData(new Category { Id = 9, CategoryName = "Blazor",  WhenAdded = DateTime.Now });
            model.Entity<Category>().HasData(new Category { Id = 10, CategoryName = "Bomber Jackets",  WhenAdded = DateTime.Now });
            model.Entity<Category>().HasData(new Category { Id = 11, CategoryName = "Casual Jackets", WhenAdded = DateTime.Now });
            model.Entity<Category>().HasData(new Category { Id = 12, CategoryName = "Denim Jackets",  WhenAdded = DateTime.Now });

            /* Seed Brands Table */
            model.Entity<Brands>().HasData(new Brands { Id = 1, BrandName = "S Max Mara", WhenAdded = DateTime.Now });
            model.Entity<Brands>().HasData(new Brands { Id = 2, BrandName = "3.1 Philip lim",  WhenAdded = DateTime.Now });
            model.Entity<Brands>().HasData(new Brands { Id = 3, BrandName = "A.L.C",  WhenAdded = DateTime.Now });

            model.Entity<Brands>().HasData(new Brands { Id = 4, BrandName = "Alice + Oliva",  WhenAdded = DateTime.Now });
            model.Entity<Brands>().HasData(new Brands { Id = 5, BrandName = "American Vintage",  WhenAdded = DateTime.Now });
            model.Entity<Brands>().HasData(new Brands { Id = 6, BrandName = "Barbour by Alexachung", WhenAdded = DateTime.Now });
            model.Entity<Brands>().HasData(new Brands { Id = 7, BrandName = "By Melene Birger", WhenAdded = DateTime.Now });

            model.Entity<Brands>().HasData(new Brands { Id = 8, BrandName = "Acne Studios",   WhenAdded = DateTime.Now });
            model.Entity<Brands>().HasData(new Brands { Id = 9, BrandName = "Alexander McQueen",   WhenAdded = DateTime.Now });
            model.Entity<Brands>().HasData(new Brands { Id = 10, BrandName = "Alice + Oliva",   WhenAdded = DateTime.Now });

            /* Seed Color Table */
            model.Entity<ProductColor>().HasData(new ProductColor { Id = 1, ColorName = "Black", WhenAdded = DateTime.Now });
            model.Entity<ProductColor>().HasData(new ProductColor { Id = 2, ColorName = "Blue", WhenAdded = DateTime.Now });
            model.Entity<ProductColor>().HasData(new ProductColor { Id = 3, ColorName = "Brown", WhenAdded = DateTime.Now });
            model.Entity<ProductColor>().HasData(new ProductColor { Id = 13, ColorName = "Creamy", WhenAdded = DateTime.Now });
            model.Entity<ProductColor>().HasData(new ProductColor { Id = 4, ColorName = "Gold", WhenAdded = DateTime.Now });
            model.Entity<ProductColor>().HasData(new ProductColor { Id = 5, ColorName = "Green", WhenAdded = DateTime.Now });
            model.Entity<ProductColor>().HasData(new ProductColor { Id = 6, ColorName = "Gray", WhenAdded = DateTime.Now });
            model.Entity<ProductColor>().HasData(new ProductColor { Id = 7, ColorName = "Pink", WhenAdded = DateTime.Now });
            model.Entity<ProductColor>().HasData(new ProductColor { Id = 8, ColorName = "Purple", WhenAdded = DateTime.Now });
            model.Entity<ProductColor>().HasData(new ProductColor { Id = 9, ColorName = "White", WhenAdded = DateTime.Now });
            model.Entity<ProductColor>().HasData(new ProductColor { Id = 10, ColorName = "Yellow", WhenAdded = DateTime.Now });
            model.Entity<ProductColor>().HasData(new ProductColor { Id = 11, ColorName = "Multi", WhenAdded = DateTime.Now });
            model.Entity<ProductColor>().HasData(new ProductColor { Id = 12, ColorName = "Bronze", WhenAdded = DateTime.Now });

            /* Seed Size Table */
            model.Entity<ItemSize>().HasData(new ItemSize { Id = 1,  SizeName="XXS",  WhenAdded = DateTime.Now });
            model.Entity<ItemSize>().HasData(new ItemSize { Id = 2, SizeName = "XS/S", WhenAdded = DateTime.Now });
            model.Entity<ItemSize>().HasData(new ItemSize { Id = 3, SizeName = "XS", WhenAdded = DateTime.Now });
            model.Entity<ItemSize>().HasData(new ItemSize { Id = 4, SizeName = "S", WhenAdded = DateTime.Now });
            model.Entity<ItemSize>().HasData(new ItemSize { Id = 5, SizeName = "S/M", WhenAdded = DateTime.Now });
            model.Entity<ItemSize>().HasData(new ItemSize { Id = 6, SizeName = "M",  WhenAdded = DateTime.Now });
            model.Entity<ItemSize>().HasData(new ItemSize { Id = 7, SizeName = "M/L", WhenAdded = DateTime.Now });
            model.Entity<ItemSize>().HasData(new ItemSize { Id = 8, SizeName = "L", WhenAdded = DateTime.Now });
            model.Entity<ItemSize>().HasData(new ItemSize { Id = 9, SizeName = "XL", WhenAdded = DateTime.Now });
            model.Entity<ItemSize>().HasData(new ItemSize { Id = 10, SizeName = "XXL", WhenAdded = DateTime.Now });

           

            /* Seed Currency Table */
            model.Entity<Currency>().HasData(new Currency { Id = 1, CurrencyName = "Pound Sterling", Symbol = "£"  , WhenAdded=DateTime.Now});


           

            /* Seed Items Table */
            model.Entity<Items>().HasData(new Items { Id = 1, CurrencyId = 1, Discount = 0, ItemCode = "10432343443", ItemName = "RIXO", ItemLongName = "Brooke floral-print modal maxi dress", Qty = 20, Price = 285, ItemDetails = "", Show=true, WhenAdded=DateTime.Now  , ProductsId = 1, ItemPicturePath = "\\Women\\Dresses\\794627_multicoloured_1.jpg" ,  CategoryId=1 , BrandId =1 , ProductColorId =11 , SizeId = 3  });
            model.Entity<Items>().HasData(new Items { Id = 2, CurrencyId = 1, Discount = 0, ItemCode = "10442543642", ItemName = "ZIMMERMAN", ItemLongName = "Super Eight bronze silk-satin mini wrap dress", Qty = 50, Price = 495, ItemDetails = "", Show = true, WhenAdded = DateTime.Now, ProductsId = 1, ItemPicturePath = "\\Women\\Dresses\\769516_brown_1.jpg", CategoryId = 1, BrandId = 2, ProductColorId = 11, SizeId = 2 });
            model.Entity<Items>().HasData(new Items { Id = 3, CurrencyId = 1, Discount = 0, ItemCode = "10442543643", ItemName = "BODICE", ItemLongName = "Pink pleated silk dress", Qty = 150, Price = 655, ItemDetails = "", Show = true, WhenAdded = DateTime.Now, ProductsId = 1, ItemPicturePath = "\\Women\\Dresses\\793573_pink_and_other_1.jpg" ,CategoryId = 1, BrandId = 2, ProductColorId = 7, SizeId = 4 });
            model.Entity<Items>().HasData(new Items { Id = 4, CurrencyId = 1, Discount = 0, ItemCode = "10442543644", ItemName = "ALICE + OLIVIA", ItemLongName = "Harmony rose satin mini dress", Qty = 160, Price = 295, ItemDetails = "", Show = true, WhenAdded = DateTime.Now, ProductsId = 1, ItemPicturePath = "\\Women\\Dresses\\781975_bronze_1.jpg" , CategoryId = 1, BrandId = 4, ProductColorId = 12, SizeId = 5 });
            model.Entity<Items>().HasData(new Items { Id = 5, CurrencyId = 1, Discount = 0, ItemCode = "10442543645", ItemName = "NANUSHKA", ItemLongName = "Canaan ecru wool-blend midi dress", Qty = 85, Price = 310, ItemDetails = "", Show = true, WhenAdded = DateTime.Now, ProductsId = 1, ItemPicturePath = "\\Women\\Dresses\\773443_cream_1.jpg", CategoryId = 1, BrandId = 3, ProductColorId = 13, SizeId = 5 });





        }
    }
}
