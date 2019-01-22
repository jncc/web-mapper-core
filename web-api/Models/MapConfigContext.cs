using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace MapConfig.Models
{
    public class MapConfigContext : DbContext
    {
        public MapConfigContext(DbContextOptions<MapConfigContext> options) : base(options)
        {
        }

        public DbSet<MapConfig.Models.MapItem> MapItem { get; set; }
        public DbSet<MapConfig.Models.MapConfigItem> MapConfigItem { get; set; }
        public DbSet<MapConfig.Models.LayerItem> LayerItem { get; set; }
        public DbSet<MapConfig.Models.LayerConfigItem> LayerConfigItem { get; set; }
        public DbSet<MapConfig.Models.MapLayerItem> MapLayerItem { get; set; }

    }
}