using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessLayer.Genric.Specification
{
  public enum OrderByEnum
    {
        asc , desc
    }

    public enum ItemsOrder
    {
        ItemName ,
        Price
    }

    public enum ProductsOrder
    {
        ProductName,
        ProductId,
        WhenAdded
    }
}
