using DAL.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Linq;
using DAL.SeedData;
using DAL.Models.OrderAggregate;

namespace DAL
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
       : base(options)
        {
        }

        public DbSet<MainMenu> MainMenu { get; set; }
        public DbSet<SubMainMenu> SubMainMenu { get; set; }

        public DbSet<Products> Products { get; set; }


        public DbSet<Category> Categories { get; set; }
        public DbSet<Brands> Brands { get; set; }
        public DbSet<ProductColor> ProductColor { get; set; }

        public DbSet<ItemSize> Size { get; set; }


        public DbSet<Items> Items { get; set; }
        public DbSet<ItemImages> ItemImages { get; set; }

        public DbSet<Currency> Currencies { get; set; }

        public DbSet<ItemsThisWeek> ItemsThisWeek { get; set; }

        public DbSet<Basket> Basket { get; set; }
        public DbSet<BasketItems> BasketItems { get; set; }
        public DbSet<Orders> Orders { get; set; }
        public DbSet<OrderDetails> OrdersDetails { get; set; }



        public DbSet<Slots> Slots { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }

       
        public DbSet<RefreshToken> RefreshTokens { get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
         {
          //  modelBuilder.Entity<Customer>().HasKey(uo => new {uo.OrderId, uo.UserId });
            modelBuilder.Entity<Orders>().OwnsOne(c => c.BillingAddress);
            modelBuilder.Entity<Orders>().OwnsOne(c => c.ShippingAddress);

         
           

            base.OnModelCreating(modelBuilder);
          //  InitializeTables.Seed(modelBuilder);
        }
      
        public override int SaveChanges()
        {
            var entries = ChangeTracker.Entries()
                         .Where(e =>e.Entity  is BaseEntity &&( e.State == EntityState.Added || e.State == EntityState.Modified));
      
         foreach(var entry in entries)
            {
                ((BaseEntity)entry.Entity).WhenAdded = DateTime.Now;
            }

            return base.SaveChanges();
        }



    }

   

    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                                           .SetBasePath(Directory.GetCurrentDirectory())
                                           .AddJsonFile(@Directory.GetCurrentDirectory() + "/../ECommerceMVC/appsettings.Development.json")
                                           .Build();
            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            builder.UseSqlServer(connectionString);
            return new ApplicationDbContext(builder.Options);
        }
    }
    


}
