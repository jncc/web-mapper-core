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
        public DbSet<MapConfig.Models.LayerGroup> LayerGroup { get; set; }
        public DbSet<MapConfig.Models.Layer> Layer { get; set; }
        public DbSet<MapConfig.Models.Filter> Filter { get; set; }

    }
}