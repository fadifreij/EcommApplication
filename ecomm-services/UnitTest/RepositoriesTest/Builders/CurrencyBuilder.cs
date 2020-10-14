using DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace UnitTest.RepositoriesTest.Builders
{
   public class CurrencyBuilder
    {
        private Currency _currency;
        public string CurrencyName => "Dollar";
        public string Symbol =>"$";

        public CurrencyBuilder()
        {
            _currency = WithDefaultValues();
        }
        
        
        public Currency WithDefaultValues()
        {
            _currency = new Currency() { CurrencyName = CurrencyName, Symbol = Symbol };
            return _currency;
        }
    }
}
