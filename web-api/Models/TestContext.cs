using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Test.Models
{
    public class TestContext : DbContext
    {
        public TestContext(DbContextOptions<TestContext> options) : base(options)
        {
        }

        public DbSet<Test.Models.TestItem> TestItem { get; set; }

    }
}