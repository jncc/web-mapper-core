using System;
using Microsoft.Extensions.Options;

namespace Config.Options
{
    public class WebApiConfig
    {
        public string UseDBConnectionString { get; set; }
        public string TestDataWMSUrl { get; set; }
        public Boolean AllowCRUDPages { get; set; }
    }
}