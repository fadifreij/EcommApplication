using DAL;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace UnitTest.RepositoriesTest
{
   public class InitializeContext
    {
        protected ApplicationDbContext InitContext()
        {
              var builder = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=ECommerceDB;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
  

         /*   var builder = new DbContextOptionsBuilder<ApplicationDbContext>()
              .UseInMemoryDatabase("ECommerceDB");*/
            var context = new ApplicationDbContext(builder.Options);
            return context;
          
        }
    }
}
