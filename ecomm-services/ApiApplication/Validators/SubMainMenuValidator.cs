using DAL.Models;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Validators
{
    public class SubMainMenuValidator :AbstractValidator<SubMainMenu>
    {
        public SubMainMenuValidator()
        {
            RuleFor(s => s.SubMainMenuName).NotEmpty();
        }
    }
}
