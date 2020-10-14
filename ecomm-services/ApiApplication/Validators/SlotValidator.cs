using DAL.Models;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiApplication.Validators
{
    public class SlotValidator  :AbstractValidator<Slots>
    {
        public SlotValidator()
        {
            RuleFor(s => s.MaxNumberOfDelivery)
                .GreaterThan(0);
            RuleFor(s => s.DeliveryDate)
                .NotNull();

            RuleFor(s => s.SlotNumber)
                .GreaterThan(0);
        }
    }
}
