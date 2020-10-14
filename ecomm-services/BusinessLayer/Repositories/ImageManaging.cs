using BusinessLayer.Interfaces;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;


namespace BusinessLayer.Repositories
{
  public   class ImageManaging :IImageManaging
    {
     
        private readonly IHostingEnvironment env;

        public ImageManaging(IHostingEnvironment env)
        {
          
            this.env = env;
        }

       

        public string SaveImageToServer(IFormFile file,  string ProductName, int ItemId)
        {
            var ImageName = Path.GetFileName(file.FileName);//getting only file name (ex-ganesh.jpg) 
            var ext = Path.GetExtension(file.FileName); //getting the extension(ex-.jpg)  
            string ImageNameWithoutExtension = Path.GetFileNameWithoutExtension(ImageName); //getting Image name without extension


            var webRoot = env.WebRootPath;
            var ImageFullName = ImageNameWithoutExtension + ext;

            //Check if the folder containing the product images exists on server
            var directory = Path.Combine(webRoot, $"images\\Products\\{ProductName}\\{ItemId}");

            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            var path = Path.Combine(webRoot, $"images\\Products\\{ProductName}\\{ItemId}\\{ImageFullName}");

            //Check if image exists on folder - if yes delete it
            if (File.Exists(path))
            {
                File.Delete(path);
            }

            var stream = new FileStream(path, FileMode.Create);
            file.CopyTo(stream);
            stream.Close();
            return $"images/Products/{ProductName}/{ItemId}/{ImageFullName}";

        }

        public void DeleteImageFromServer(List<string> ImagesName, string ProductName, int ItemId)
        {
            var webRoot = env.WebRootPath;
            var directory = Path.Combine(webRoot, $"images/Products/{ProductName}/{ItemId}");


            for (var i = 0; i < ImagesName?.Count; i++)
            {
                string[] str = ImagesName[i].Split($"{ItemId}/");
                ImagesName[i] = str[1];
            }

            if (!Directory.Exists(directory))
                return;

            if (IsDirectoryEmpty(directory))
                return;

            DirectoryInfo folderInfo = new DirectoryInfo(directory);
            foreach (FileInfo file in folderInfo.GetFiles())
            { 
                if ( ImagesName is null ||  ImagesName?.IndexOf(file.Name) == -1 )
                {
                    file.Delete();
                }
            }
        }

        public void DeleteAllImagesFromFolder(string ProductName, int ItemId)
        {
            var webRoot = env.WebRootPath;
            var directory = Path.Combine(webRoot, $"images\\Products\\{ProductName}\\{ItemId}");

            if (!Directory.Exists(directory))
                return;

                DirectoryInfo folderInfo = new DirectoryInfo(directory);
                folderInfo.Delete( true);
          /*  foreach (FileInfo file in folderInfo.GetFiles())
                file.Delete();*/
        }
        public void DeleteProductFolder(string ProductName)
        {
            var webRoot = env.WebRootPath;
            var directory = Path.Combine(webRoot, $"images\\Products\\{ProductName}");
            if (!Directory.Exists(directory))
                return;

            DirectoryInfo folderInfo = new DirectoryInfo(directory);
            folderInfo.Delete(true);

        }
        public Byte[] GetImageFromServer(string ProductName, int ItemId ,string ImageFullName)
        {
            var webRoot = env.WebRootPath;
            var directory = Path.Combine(webRoot, $"images\\Products\\{ProductName}\\{ItemId}\\{ImageFullName}");
            Byte[] b;

            b = System.IO.File.ReadAllBytes(directory);

            return b;
        }
        private bool IsDirectoryEmpty(string path)
        {
            return !Directory.EnumerateFileSystemEntries(path).Any();
        }

    }
}
