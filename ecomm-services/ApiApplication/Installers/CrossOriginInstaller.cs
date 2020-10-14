using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Installers
{
    public class CrossOriginInstaller : IInstaller
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                                  builder =>
                                  {
                                      /*  builder.AllowAnyOrigin()
                                         .AllowAnyHeader()
                                         .AllowAnyMethod();*/
                                      builder.SetIsOriginAllowed(host => true)
                                        .AllowAnyHeader()
                                        .AllowAnyMethod();
                                  });
            });
        }
    }
}
