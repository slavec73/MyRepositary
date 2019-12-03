using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UserApi.Models
{
    public class User
    {
        public int id { get; set; }
        public string name { get; set; }
        public DateTime date { get; set; }
        public byte gender { get; set; }
        public int task { get; set; }
       

    }
}