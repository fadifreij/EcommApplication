using DAL.Models;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Validators
{
    public class ItemValidator :AbstractValidator<Items>
    {
        public ItemValidator()
        {
         /*   RuleFor(i => i.ItemName)
                .NotNull();
            RuleFor(i => i.Price)
                .GreaterThan(0);
            RuleFor(i => i.ProductsId)
                .NotNull()
               .GreaterThan(0);
              
            RuleFor(i => i.BrandId)
                .NotNull()
                .GreaterThan(0);
            RuleFor(i => i.SizeId)
                .NotNull()
                .GreaterThan(0);
            RuleFor(i => i.ProductColorId)
                .NotNull()
                .GreaterThan(0);
            RuleFor(i => i.CurrencyId)
                .NotNull()
                .GreaterThan(0);
            RuleFor(i => i.CategoryId)
                .NotNull()
                .GreaterThan(0);*/
        }  
    }
}
