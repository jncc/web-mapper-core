using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
namespace MapConfig.Models
{
    public class MapItem
    {
        [Key]
        public long MapId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        [DataType(DataType.Date)]
        public DateTime ReleaseDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime UpdatedDate { get; set; } 

        public List<MapConfig.Models.MapConfigItem> MapConfigItems { get; set; }
    }


    public class MapConfigItem
    {
        [Key]
        public long MapConfigId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public string Comment { get; set; }

        [DataType(DataType.Date)]
        public DateTime UpdatedDate { get; set; } 

        //foreign keys
        public long MapId { get; set; }
        public MapConfig.Models.MapItem MapItem { get; set; }
    }

    public class LayerItem
    {
        [Key]
        public long LayerId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        [DataType(DataType.Date)]
        public DateTime ReleaseDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime UpdatedDate { get; set; } 

        public List<MapConfig.Models.LayerConfigItem> LayerConfigItems { get; set; }       
    }

    public class LayerConfigItem
    {
        [Key]
        public long LayerConfigId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public string Comment { get; set; }

        [DataType(DataType.Date)]
        public DateTime UpdatedDate { get; set; } 

        //foreign keys
        public long LayerId { get; set; }
        public MapConfig.Models.LayerItem LayerItem { get; set; }
    }

    public class MapLayerItem
    {
        [Key]
        public long MapLayerId { get; set; }
        public int LayerOrder { get; set; }
        public bool LayerVisible { get; set; }
        public string Comment { get; set; }

        [DataType(DataType.Date)]
        public DateTime UpdatedDate { get; set; } 

        //foreign keys
        public long MapId { get; set; }
        public MapConfig.Models.MapItem MapItem { get; set; }
        public long LayerId { get; set; }
        public MapConfig.Models.LayerItem LayerItem { get; set; }
    }
}