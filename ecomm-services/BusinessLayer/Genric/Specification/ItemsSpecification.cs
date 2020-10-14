using BusinessLayer.Genric.PagingOrderingSpecification;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace BusinessLayer.Genric.Specification
{
    public class ItemsSpecification : BaseSpecification<Items>
    {
        public ItemsSpecification(int? ProductId, int? ItemId, Expression<Func<Items,object>> OrderBy, OrderByEnum OrderByType = OrderByEnum.asc)
        :base(I => I.ProductsId == ProductId && (!ItemId.HasValue || I.Id == ItemId))
        {
            if (OrderBy != null)
            {
                if (OrderByType == OrderByEnum.asc)
                    ApplyOrderBy(OrderBy);
                else
                {
                    ApplyOrderByDesc(OrderBy);
                }
             }
            IncludeStrings.Add("Currency");
        }
        
}
}
       
   

