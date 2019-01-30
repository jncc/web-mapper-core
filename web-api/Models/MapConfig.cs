using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;//this one is for [NotMapped]
using System.Collections.Generic;
namespace MapConfig.Models
{
    public class MapInstance
    {
        [Key]
        public long MapInstanceId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Centre { get; set; }
        public int Zoom { get; set; }
        public string BaseLayerList { get; set; } //comma separated either BaseLayerIds or Names

        [NotMapped]
        public List<BaseLayer> BaseLayers { get; set; }

        //foreign keys
        public List<LayerGroup> LayerGroups { get; set; }
    }

    public class BaseLayer
    {
        [Key]
        public long BaseLayerId { get; set; }
        public string Name { get; set; }
        public string MetadataUrl { get; set; } //used for attribution?
        public string Type { get; set; }
        public string Url { get; set; }
        public Boolean Visible { get; set; }
    }

    public class LayerGroup
    {
        [Key]
        public long LayerGroupId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }   //Short Descriptive text about the LayerGroup incl. HTML

        //foreign keys
        public long MapInstanceId { get; set; }
        public MapInstance Map { get; set; }
        public List<Layer> Layers { get; set; }
    }

    public class Layer {
        [Key]
        public long LayerId { get; set; }
        public string Name { get; set; }          //Layer Name
        public string Description { get; set; }   //Short Descriptive text about the layer incl. HTML
        public string MetadataUrl { get; set; }   //(?) Icon after Layer Name
        public string SubLayerGroup { get; set; } //Optional sub group to be grouped in
        public string Type { get; set; }          //Layer Source type e.g. WMS WMTS Tile etc.
        public string Url { get; set; }           //Base Url not including filter params
        public long Order { get; set; }           // Initial Order in the Layer Group (or SubLayerGroup)
        public Boolean Visible { get; set; }      //Initial Visibility
        [Range(0.0f,1.0f)]
        public float Opacity { get; set; }         //Initial Opacity

        //foreign keys
        public long LayerGroupId { get; set; }
        public LayerGroup LayerGroup { get; set; }
        public List<Filter> Filters { get; set; }     
    }

    public class Filter {
        [Key]
        public long FilterId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string MetadataUrl { get; set; }
        public string Type { get; set; } //can be one of 'Lookup' (as in select box),'LookupMulti' (multi select box),'Date','Boolean','text'
        public string Attribute { get; set; } // name of the WMS attribute to send
        public string LookupCategory { get; set; } //name of the Filter Category to lookup        
        
        //foreign keys
        public long LayerId { get; set; }
        public Layer Layer { get; set; }
    }

    public class Lookup {
        [Key]
        public long LookupId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string LookupCategory { get; set; }
    }
}