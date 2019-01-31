using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;//this one is for [NotMapped]
using System.Collections.Generic;
namespace MapConfig.Models
{
    public class MapInstance
    {
        [Key]
        public long MapInstanceId { get; set; } //Unique Map Instance ID
        public string Name { get; set; }        //Map name
        public string Description { get; set; } //Map description (may contain HTML)
        public string Centre { get; set; }      //Initial Map Centre in EPSG:4326, e.g. [52.0,-3.0]
        public int Zoom { get; set; }           //Initial Zoom Level 1-22
        public string BaseLayerList { get; set; }//Comma separated list of either BaseLayerIds or Names

        [NotMapped]
        public List<BaseLayer> BaseLayers { get; set; }

        //foreign keys
        public List<LayerGroup> LayerGroups { get; set; }
    }

    public class BaseLayer
    {
        [Key]
        public long BaseLayerId { get; set; }   //Unique BaseLayer ID
        public string Name { get; set; }        //Unique BaseLayer Name
        public string MetadataUrl { get; set; } //could be used for BaseLayer attribution?
        public string Type { get; set; }        //the type of layer, e.g. OSM, Bing, Tile etc.
        public string Url { get; set; }         //the source Url for the layer
        public Boolean Visible { get; set; }    //is the layer visible initially?
    }

    public class LayerGroup
    {
        [Key]
        public long LayerGroupId { get; set; }   //Unique LayerGroup ID
        public string Name { get; set; }         //Layer Group Name
        public string Description { get; set; }  //Short Descriptive text about the LayerGroup (can contain HTML)

        //foreign keys
        public long MapInstanceId { get; set; }  //Which MapInstance do I belong to?
        public MapInstance Map { get; set; }
        public List<Layer> Layers { get; set; }
    }

    public class Layer {
        [Key]
        public long LayerId { get; set; }         //Unique Layer ID
        public string Name { get; set; }          //Layer Name
        public string Description { get; set; }   //Short Descriptive text about the layer (can contain HTML)
        public string MetadataUrl { get; set; }   //(?) Icon after Layer Name to external page?
        public string SubLayerGroup { get; set; } //Optional sub group to be grouped in or NULL
        public string Type { get; set; }          //Layer Source type e.g. WMS WMTS Tile etc.
        public string Url { get; set; }           //Base Url not including filter params
        public long Order { get; set; }           //Initial Order in the Layer Group (or SubLayerGroup)
        public Boolean Visible { get; set; }      //Initial Visibility
        [Range(0.0f,1.0f)]
        public float Opacity { get; set; }        //Initial Opacity

        //foreign keys
        public long LayerGroupId { get; set; }    //which LayerGroup am I in?
        public LayerGroup LayerGroup { get; set; }
        public List<Filter> Filters { get; set; }     
    }

    public class Filter {
        [Key]
        public long FilterId { get; set; }          //Unique Filter ID
        public string Name { get; set; }            //Filter Name
        public string Description { get; set; }     //Short Descriptive text about the filter (can contain HTML)
        public string MetadataUrl { get; set; }     //(?) icon to page with more info about the filter? 
        public string Type { get; set; }            //could be one of 'Lookup' (as in select box),'LookupMulti' (multi select box),'Date','Boolean','text'
        public string Attribute { get; set; }       //name of the WMS attribute to send
        public string LookupCategory { get; set; }  //name of the Filter Category to lookup        
        
        //foreign keys
        public long LayerId { get; set; }           //which Layer do I belong to?
        public Layer Layer { get; set; }
    }

    public class Lookup {
        [Key]
        public long LookupId { get; set; }      //unique Lookup ID
        public string Code { get; set; }        //lookup code (maps to value in a select box)
        public string Name { get; set; }        //lookup name (maps to the text in a select box)
        public string LookupCategory { get; set; } //which lookup category am I in?
    }
}