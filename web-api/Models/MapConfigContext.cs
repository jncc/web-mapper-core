using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace MapConfig.Models
{
    public class MapConfigContext : DbContext
    {
        public MapConfigContext(DbContextOptions<MapConfigContext> options) : base(options)
        {
        }

        public DbSet<MapConfig.Models.MapInstance> MapInstance { get; set; }
        public DbSet<MapConfig.Models.BaseLayer> BaseLayer { get; set; }
        public DbSet<MapConfig.Models.LayerGroup> LayerGroup { get; set; }
        public DbSet<MapConfig.Models.Layer> Layer { get; set; }
        public DbSet<MapConfig.Models.Filter> Filter { get; set; }

        public DbSet<MapConfig.Models.Lookup> Lookup { get; set; }

        // Fluent API ovverides for field definitions
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MapInstance>().HasIndex(m => m.Name).IsUnique();
            modelBuilder.Entity<BaseLayer>().HasIndex(b => b.Name).IsUnique();
            modelBuilder.Entity<Layer>().HasIndex(l => l.Name);
            modelBuilder.Entity<LayerGroup>().HasIndex(l => l.Name);
            modelBuilder.Entity<Filter>().HasIndex(f => f.Name);
            modelBuilder.Entity<Lookup>().HasIndex(l => l.LookupCategory);
        }


    }
}