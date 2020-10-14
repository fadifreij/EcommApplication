using DAL.Models;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Validators
{
    public class ItemsThisWeekValidator :AbstractValidator<ItemsThisWeek>
    {
        public ItemsThisWeekValidator()
        {
            RuleFor(i => i.ItemsId)
               .GreaterThan(0);
                
        }
    }
}
