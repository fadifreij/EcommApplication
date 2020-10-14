using DAL.Models;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Validators
{
    public class AddressValidator :AbstractValidator<Address>
    {
        public AddressValidator()
        {
            RuleFor(a => a.Country)
                .NotNull()
                .NotEmpty();

            RuleFor(a => a.PostCode)
                .NotNull()
                .NotEmpty();

            RuleFor(a => a.Telephone)
                .NotNull()
                .NotEmpty();

            RuleFor(a => a.Street)
                .NotNull()
                .NotEmpty();
                
        }
    }
}
