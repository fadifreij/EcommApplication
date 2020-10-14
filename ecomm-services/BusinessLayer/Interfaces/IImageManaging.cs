using DAL.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace BusinessLayer.Interfaces
{
  public  interface IImageManaging
    {
        
        
        string SaveImageToServer(IFormFile file,  string ProductName, int ItemId);

        void DeleteImageFromServer(List<string> ImagesName, string ProductName, int ItemId);
        void DeleteAllImagesFromFolder(string ProductName, int ItemId);
        void DeleteProductFolder(string ProductName);
        Byte[] GetImageFromServer(string ProductName, int ItemId, string ImageFullName);
    }
}
