using BusinessLayer.Genric;
using BusinessLayer.Repositories;
using DAL;
using DAL.Models;
using System;
using System.Linq;
using UnitTest.RepositoriesTest.Builders;
using Xunit;
using Xunit.Abstractions;

namespace UnitTest.RepositoriesTest
{
  
    public  class CurrencyRepositoryTest : InitializeContext
    {
        private CurrencyBuilder CurrencyBuilder { get; } = new CurrencyBuilder();
        IUnitOfWork<Currency> _repository;
        private readonly ITestOutputHelper _output;


        public CurrencyRepositoryTest(ITestOutputHelper output)
        {
          var context =  InitContext();
             _repository = new UnitOfWork<Currency>(context);
            _output = output;
        }
      

        [Fact]
       public void TestCurrencyGetAll()
        {
         
            var list = _repository.GetAll();
            var cnt = list.ToList().Count();
            _output.WriteLine($" Currency Id = {list.FirstOrDefault().Id}");

            Assert.Equal(1, cnt);
        }
        [Fact]
        public void TestCurrencyGetById()
        {
            var Id = 1;
            var currency = _repository.GetById(Id);
            Assert.NotNull(currency);
        }
        [Fact]
        public void TestCurrencyAddNew()
        {
            var currency = CurrencyBuilder.WithDefaultValues();
            _repository.Insert(currency);
            _repository.Save();
            var list = _repository.GetAll();
            var cnt = list.ToList().Count();
            Assert.Equal(2, cnt);
        }
        [Fact]
        public void TestCurrencyUpdate()
        {
            var currency = new Currency {Id=3, CurrencyName = "Pound Sterling", Symbol = "£" };
            _repository.Update(currency);
            _repository.Save();
            var list = _repository.GetAll();
            var cnt = list.ToList().Count();
            Assert.Equal(2, cnt);
        }
        [Fact]
        public void TestCurrencyDelete()
        {
            var Id = 3;
            _repository.Delete(Id);
            _repository.Save();
            var list = _repository.GetAll();
            var cnt = list.ToList().Count();
            Assert.Equal(1, cnt);
        }
    }
}
