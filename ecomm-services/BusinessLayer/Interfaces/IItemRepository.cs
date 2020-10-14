using BusinessLayer.Genric.Specification;
using BusinessLayer.Genric;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace BusinessLayer.Interfaces
{
  public  interface IItemRepository : IUnitOfWork<Items>
    {
        IEnumerable<Items> ListAll( int ProductId, int? ItemId , ItemsOrder OrderBy , OrderByEnum OrderByType);
        IEnumerable<Items> ListAll(int? ProductId,
                                                 int? ItemId,
                                                 int? CategoryId,
                                                 string BrandId,
                                                 string ProductColorId,
                                                 string SizeId,
                                                 int? skip, int? take, ItemsOrder OrderBy, OrderByEnum OrderByType);


        void AddItem(Items items, IFormFile favoriteImage, List<IFormFile> images, bool isImageChange, bool isListChange);

        IEnumerable<KeyTables> GetKeyTables();

    }
}
