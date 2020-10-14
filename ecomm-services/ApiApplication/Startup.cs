using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ApiApplication.Core;
using ApiApplication.Presistence;

using BusinessLayer.Genric;
using BusinessLayer.Interfaces;
using BusinessLayer.Repositories;
using DAL;
using DAL.Models;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace ApiApplication
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            var installers = typeof(Startup).Assembly.ExportedTypes.Where(x =>
               typeof(IInstaller).IsAssignableFrom(x) && !x.IsInterface && !x.IsAbstract ).Select(Activator.CreateInstance).Cast<IInstaller>().ToList();

            installers.ForEach(installer => installer.InstallServices(services, Configuration));

           //To stop auto ModelState validation for each action put this true
            services.Configure<ApiBehaviorOptions>(option => option.SuppressModelStateInvalidFilter = false);

            services.Configure<FormOptions>(x =>
            {
                x.MultipartBodyLengthLimit = 60000000;
            });

            /*
              services.AddDbContextPool<ApplicationDbContext>(
                options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"))
                );

              services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

              services.AddAuthentication(options =>
              {
                  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
              }

                 )
                 .AddJwtBearer(options => {
                     options.TokenValidationParameters = new TokenValidationParameters
                     {
                         ValidateIssuer = true,
                         ValidateAudience = true,
                         ValidateLifetime = true,
                         ValidateIssuerSigningKey = true,
                         ValidIssuer = Configuration["Token:Issuer"],
                         ValidAudience = Configuration["Token:Audience"],
                         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["SecretKey"]))
                     };
                 });

              services.Configure<IdentityOptions>(option => {
                  option.Password.RequiredLength = 5;
                  option.Password.RequiredUniqueChars = 3;
              });

              services.AddScoped<IAuthRepository, AuthRepository>();
              services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
              services.AddScoped(typeof(IUnitOfWork<>), typeof(UnitOfWork<>));

              services.AddScoped<IItemRepository, ItemRepository>();
              services.AddScoped<IBasketRepository, BasketRepository>();


              // Register the Swagger generator, defining 1 or more Swagger documents
              services.AddSwaggerGen(c =>
              {
                  c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
                  // c.OperationFilter<FileUploadOperation>();
              });

              services.AddMemoryCache();
              services.AddMvc(option =>
              {
                  option.EnableEndpointRouting = false;
                  //  option.Filters.Add(typeof(ValidationFilter));

              }
              )
                  .AddFluentValidation(options => options.RegisterValidatorsFromAssemblyContaining<Startup>())

                   .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
              services.AddControllers()
                  .AddNewtonsoftJson(
                  option => option.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                  );

            */

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

               

            }

            app.UseDeveloperExceptionPage();
            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                c.RoutePrefix = "swagger/ui";
                // because you put RoutePrefix swagger/ui to call swagger ui http://localhost:54801/swagger/ui/
            });


            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
