using DAL.Models;
using Swashbuckle.AspNetCore.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.SwashbuckleExamples.Requests
{
    public class CreateMainMenuRequest : IExamplesProvider<MainMenu>
    {
        public MainMenu GetExamples()
        {
            return new MainMenu
            {
                MainMenuName = "Test",
                Show = true
            };
        }


      
    }
}
