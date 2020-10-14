using BusinessLayer.Genric.PagingOrderingSpecification;
using DAL.Models;
using System;
using System.Collections.Generic;

using System.Linq.Expressions;
using System.Text;

namespace BusinessLayer.Genric.Specification
{
    public class ItemsPaginatedSpecification : BaseSpecification<Items>
    {
        public ItemsPaginatedSpecification(int? ProductId,
                                           int? ItemId,
                                           int? CategoryId,
                                           int? Skip,
                                           int? Take ,
                                           Expression<Func<Items, object>> OrderBy,
                                           OrderByEnum orderType,
                                           List<int> BrandId = null,
                                           List<int> ProductColorId = null,
                                           List<int> SizeId = null

            )
            :base(I=> (!ProductId.HasValue || I.ProductsId ==ProductId ) && 
             (!ItemId.HasValue || I.Id == ItemId )  &&
             (!CategoryId.HasValue || I.CategoryId == CategoryId) &&
             ( BrandId == null || BrandId.Contains(I.BrandId)) &&
             (ProductColorId==null || ProductColorId.Contains(I.ProductColorId)) &&
             (SizeId==null || SizeId.Contains(I.SizeId)) && (I.Show == true))
        {
            if(Skip.HasValue && Take.HasValue)
            {
                ApplyPaging(Take.Value, Skip.Value);
            }
            if(orderType == OrderByEnum.asc)
            {
                ApplyOrderBy(OrderBy);
            }
            else
            {
                ApplyOrderByDesc(OrderBy);
            }

           
            
                Includes.Add(i => i.Category);
                Includes.Add(i => i.Brand);
                Includes.Add(i => i.ProductColor);
                Includes.Add(i => i.Size);
            
            IncludeStrings.Add("Currency");
        }
    }
}
