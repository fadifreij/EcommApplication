using DAL.Models;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Validators
{
    public class MainMenuValidator :AbstractValidator<MainMenu>
    {
        public MainMenuValidator()
        {
            RuleFor(x => x.MainMenuName )
                   .NotEmpty()
                   .NotNull()
                   .WithMessage("MainMenu Name is required");

          
           
        }
    }
}
