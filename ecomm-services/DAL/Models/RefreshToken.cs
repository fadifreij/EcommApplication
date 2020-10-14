using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
   public class RefreshToken 
    {
        public string Id { get; set; }
        public string UserId { get; set; }

      
        public string Value { get; set; }

       
        public DateTime ExpirationDate { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime LastModified { get; set; }
       
        public int TotalRefresh { get; set; }

       
        public bool Revoked { get; set; }

        public ApplicationUser User { get; set; }
    }
}
