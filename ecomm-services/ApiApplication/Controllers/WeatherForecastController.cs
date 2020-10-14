using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ApiApplication.Controllers
{
   
    
    public class WeatherForecastController : BaseController
    {
       
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

      
        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        ///  Returns All the forcast in the system
        /// </summary>
        /// <response code = "200"> Returns all the forcase in the system</response>
        /// <response code = "400"> Unable to create the </response>    
        [HttpGet]
        [ActionName("Get")]
        public IEnumerable<WeatherForecast> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }
       [HttpGet]
       [Route("GetBy/{first}/{second}")]
        public string GetString(int id,string first,string second)
        {
            return $"hi {first} {second}";
        }
    }
}
