using DAL;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Genric
{
    public class UnitOfWork<T> :IDisposable, IUnitOfWork<T> where T : class
    {
        private readonly ApplicationDbContext _db;
        private DbSet<T> table = null;

        public UnitOfWork(ApplicationDbContext db)
        {
            this._db = db;
            table = _db.Set<T>();
          
        }

        public virtual  IQueryable<T> GetAll()
        {
           
            return    table;
            //  return await table.ToListAsync();


        }
        public IQueryable<T> GetAll(params Expression<Func<T, object>>[] NavigationProperties)
        {
            IQueryable<T> query = table;
            foreach(Expression<Func<T,object>> property in NavigationProperties)
                 query = query.Include<T,object>(property);

            return query;
            
        }

        public IQueryable<T> GetBy(Expression<Func<T, bool>> criteria, params Expression<Func<T,object>>[] NavigationProperties)
        {
            IQueryable<T> query = table;
            foreach (Expression<Func<T, object>> property in NavigationProperties)
                query = query.Include<T, object>(property);
            
            return query.Where(criteria);
        }
        public virtual T GetById(object id)
        {
            return table.Find(id);
        }

        public virtual void Insert(T obj)
         {
            table.Add(obj);
         }


        public virtual void Update(T obj)
        {
            table.Attach(obj);
            _db.Entry(obj).State = EntityState.Modified;

        }
        public virtual void Delete(object id)
        {
           T existing =  table.Find(id);
            table.Remove(existing);
        }

       public void Save()
        {
            _db.SaveChanges();
        }

        public async Task CompleteAsync()
        {
            await _db.SaveChangesAsync();
        }

        public void Dispose()
        {
            _db.Dispose();
        }
    }
}
