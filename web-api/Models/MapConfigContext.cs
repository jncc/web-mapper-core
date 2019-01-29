using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace MapConfig.Models
{
    public class MapConfigContext : DbContext
    {
        public MapConfigContext(DbContextOptions<MapConfigContext> options) : base(options)
        {
        }

        public DbSet<MapConfig.Models.MapInstance> MapInstances { get; set; }
        public DbSet<MapConfig.Models.LayerGroup> LayerGroups { get; set; }
        public DbSet<MapConfig.Models.Layer> Layers { get; set; }
        public DbSet<MapConfig.Models.Filter> Filters { get; set; }

    }
}