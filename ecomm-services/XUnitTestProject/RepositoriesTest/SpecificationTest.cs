

using BusinessLayer.Interfaces;
using BusinessLayer.Repositories;
using BusinessLayer.Genric.Specification;
using DAL;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace XUnitTestProject.RepositoriesTest
{
   public class SpecificationTest : InitializeContext
    {
        IItemRepository _repository;

        private ApplicationDbContext db;
        public SpecificationTest()
        {
            var context = InitContext();
            db = context;
            _repository = new ItemRepository(context);
        }

        [Fact]
        public void TestListAll()
        {
            var list = _repository.ListAll(1,null,ItemsOrder.ItemName,OrderByEnum.desc);
                                
            var rec = list.FirstOrDefault();
            Assert.Equal(2, rec.Id);
        }

        [Fact]
        public void TestListPagination()
        {
          /*  var list = _repository.GetAll();
            var brandName = "Alice + Oliva";
            */

          
           
           
/*        
            ISpecification<Brands> spec = new ExpressionSpecification<Brands>(o => o.BrandName == brandName);
           var list1 = list.Where(q => spec.IsStatisfiedBy(q));

           
          //  var cnt = list1.ToList().Count();
            Assert.Equal(2, 2);*/
        }
    }
}
