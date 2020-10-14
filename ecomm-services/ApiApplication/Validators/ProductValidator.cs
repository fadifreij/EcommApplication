using DAL.Models;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Validators
{
    public class ProductValidator :AbstractValidator<Products>
    {
        public ProductValidator()
        {
            RuleFor(p => p.ProductName).NotNull();
           
        }
    }
}
