using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Genric
{
  public  interface IUnitOfWork<T> where T :class
    {
        IQueryable<T> GetAll();
        IQueryable<T> GetAll(params Expression<Func<T, object>>[] NavigationProperty);
      
        IQueryable<T> GetBy(Expression<Func<T, bool>> criteria, params Expression<Func<T, object>>[] NavigationProperties);
        T GetById(object id);
        void Insert(T obj);
        void Update(T obj);
        void Delete(object id);
        void Save();
        Task CompleteAsync();
    }
}
