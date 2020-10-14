using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace BusinessLayer.Genric.PagingOrderingSpecification
{
    public class BaseSpecification<T> : ISpecification<T>
    {

      
        public BaseSpecification(Expression<Func<T,bool>> criteria)
        {
            Criteria = criteria;
        }
        public Expression<Func<T, bool>> Criteria { get; }
        public List<Expression<Func<T, object>>> Includes { get; } = new List<Expression<Func<T, object>>>();
        public List<string> IncludeStrings { get; } = new List<string>();

        public Expression<Func<T, object>> OrderBy { get; private  set; }

        public Expression<Func<T, object>> OrderByDescending { get; private  set; }

        public int Take { get; private  set; }

        public int Skip { get;  set; }
        public bool IsPagingEnabled { get; private set; }
       
        protected virtual void ApplyPaging(int Take,int Skip)
        {
            this.Take = Take;
            this.Skip = Skip;
            this.IsPagingEnabled = true;
        }
        protected virtual void ApplyOrderBy(Expression<Func<T,object>> orderByExpression)
        {
            this.OrderBy = orderByExpression;
        }
        protected virtual void ApplyOrderByDesc(Expression<Func<T,object>> orderByDescExpression)
        {
            this.OrderByDescending = orderByDescExpression;
        }
    }
}
