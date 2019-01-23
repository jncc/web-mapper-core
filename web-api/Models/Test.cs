using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
namespace Test.Models
{
    public class TestItem
    {
        [Key]
        public long TestId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

    }
}