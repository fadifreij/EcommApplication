using BusinessLayer.Genric.PagingOrderingSpecification;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace BusinessLayer.Genric.Specification
{
   public class ProductsSpecification : BaseSpecification<Products>
    {
        public ProductsSpecification(Expression<Func<Products,bool>> criteria,
                                     Expression<Func<Products, object>> OrderBy,
                                     OrderByEnum OrderByType = OrderByEnum.asc ):base(criteria)
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
            Includes.Add(p => p.SubMainMenu);
            Includes.Add(p => p.SubMainMenu.MainMenu);
        }
    }
}
