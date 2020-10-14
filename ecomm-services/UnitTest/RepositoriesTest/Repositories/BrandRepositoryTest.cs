using BusinessLayer.Genric;
using DAL.Models;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace UnitTest.RepositoriesTest.Repositories
{
  public  class BrandRepositoryTest
    {
        private Mock<IUnitOfWork<Brands>> _mockBrandsRepo;


        public BrandRepositoryTest()
        {
            _mockBrandsRepo = new Mock<IUnitOfWork<Brands>>();
        }
        [Fact]
        public void Should_InsertRepo_NotNull()
        {
            var brands = new Brands();
            _mockBrandsRepo.Setup(x => x.Insert(new Brands { BrandName = It.IsAny<string>() }));
            _mockBrandsRepo.Setup(x => x.Save());
            //_mockBrandsRepo.Setup(x=>x.GetById(1)).Returns
      

        }
        [Fact]
        public void Should_InvokeDeleteRepo_Once()
        {

            var brands = new Brands();
            _mockBrandsRepo.Setup(x => x.Insert( new Brands { Id = 1, BrandName = It.IsAny<string>()  }));
        }
    }
}
