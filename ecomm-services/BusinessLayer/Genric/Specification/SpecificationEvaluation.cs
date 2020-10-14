using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.EntityFrameworkCore;
namespace BusinessLayer.Genric.PagingOrderingSpecification
{
   public class SpecificationEvaluation<T> where T : class
    {
        public static IQueryable<T> GetQuery(IQueryable<T> InputList, ISpecification<T> spec)
        {
            var query = InputList;
          
            if(spec.Criteria != null)
            {
                query = query.Where(spec.Criteria);
            }
            // Includes all expression-based includes
            query = spec.Includes.Aggregate(query,
                                    (current, include) => current.Include(include));

        
            // Include any string-based include statements
            query = spec.IncludeStrings.Aggregate(query,
                                    (current, include) => current.Include(include));


            if (spec.OrderBy != null)
            {
                query = query.OrderBy(spec.OrderBy);
            }

            else if (spec.OrderByDescending != null)
            {
                query = query.OrderByDescending(spec.OrderByDescending);
            }


            if (spec.IsPagingEnabled)
            {
                query = query.Skip(spec.Skip).Take(spec.Take);
            }
            return query;
        }
    }
}
