using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Installers
{
    public class MvcInstaller : IInstaller
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {
            // Add memory cache services
            services.AddMemoryCache();
            services.AddMvc(option =>
            {
                option.EnableEndpointRouting = false;
                //  option.Filters.Add(typeof(ValidationFilter));

            }
            )
                .AddFluentValidation(options => options.RegisterValidatorsFromAssemblyContaining<Startup>())

                 .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
            services.AddControllers(
                options =>
                {
                    options.RespectBrowserAcceptHeader = true;
                }
                )
                .AddNewtonsoftJson(
                option => option.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                );

        }
    }
}
