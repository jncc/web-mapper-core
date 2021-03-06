using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;//this one is for [NotMapped]
using System.Collections.Generic;
using Newtonsoft.Json;
namespace MapConfig.Models
{
    public class MapInstance
    {
        [Key]
        public long MapInstanceId { get; set; }     //Unique Map Instance ID
        public string Name { get; set; }            //Map name
        public string Description { get; set; }     //Map description (may contain HTML)
        public string Attribution { get; set; }     //Map Attribution (may contain HTML)
        [JsonIgnore]
        public double MapCentreLon { get; set; }    //Initial Map Centre Longitude in EPSG:4326 (X)
        [JsonIgnore]
        public double MapCentreLat { get; set; }    //Initial Map Centre Latitude in EPSG:4326 (Y)
        [JsonIgnore]
        public int MapZoom { get; set; }            //Initial Map Zoom Level 1-22
        public int MaxZoom { get; set; }            //Maximum Zoom Level for this Map
        [JsonIgnore]
        public string BaseLayerList { get; set; }   //Comma separated list of additional BaseLayers (either BaseLayerIds or Names)
        [JsonIgnore]
        public string VisibleBaseLayer { get; set; }//which additional BaseLayer is initially visible? (either BaseLayerId or Name)

        public Boolean AllowLayerHighlight { get; set; } //is the mapper allowed to request _hightlight ed layers

        [NotMapped]
        public double[] Center { get; set; } = new double[2];       //what's actually sent in the JSON response (an array)
        [NotMapped]
        public int Zoom { get; set; }               //what's actually sent in the JSON response
        [NotMapped]
        public List<BaseLayer> BaseLayers { get; set; }

        //foreign keys
        public List<ExternalWmsUrl> ExternalWmsUrls { get; set; }
        public List<LayerGroup> LayerGroups { get; set; }
    }

    public class BaseLayer
    {
        [Key]
        public long BaseLayerId { get; set; }   //Unique BaseLayer ID
        public string Name { get; set; }        //Unique BaseLayer Name
        public string Attribution { get; set; } //BaseLayer attribution text
        public string AttributionUrl { get; set; } //BaseLayer attribution URL
        public string Url { get; set; }         //the source WMS Url
        public string LayerName { get; set; }   //the name of the WMS Layer 
        [NotMapped]
        public Boolean Visible { get; set; }    //set by the /api/MapInstance endpoint if this baselayer is the default visible
    }

    public class ExternalWmsUrl
    {
        [Key]
        public long ExternalWmsUrlId { get; set; } //Unique External WMS ID
        public string Name { get; set; }        //External WMS Name
        public string Description { get; set; } //Short Descriptive text about the External WMS source (can contain HTML)
        public string Url { get; set; }         //URL of the WMS source

        //foreign keys
        public long MapInstanceId { get; set; }  //Which MapInstance do I belong to?
        public MapInstance Map { get; set; }
    }

    public class LayerGroup
    {
        [Key]
        public long LayerGroupId { get; set; }   //Unique LayerGroup ID
        public string Name { get; set; }         //Layer Group Name
        public string Description { get; set; }  //Short Descriptive text about the LayerGroup (can contain HTML)
        public long Order { get; set; }           //Initial Order for the Layer Group
        public Boolean IsExternal { get; set; }   //Is this Layer Group used for external Layers?

        //foreign keys
        public long MapInstanceId { get; set; }  //Which MapInstance do I belong to?
        public MapInstance Map { get; set; }
        public List<Layer> Layers { get; set; }
    }

    public class Layer {
        //database schema
        [Key]
        public long LayerId { get; set; }         //Unique Layer ID
        public string Name { get; set; }         //Short Descriptive text about the layer (can contain HTML)
        public string MetadataDescription { get; set; } //(?) Icon after Layer Name to external page (hover text)
        public string MetadataUrl { get; set; }   //(?) Icon after Layer Name to external page (link URL)
        public string DownloadURL {get; set; }    //Link to download the dataset
        public string SubLayerGroup { get; set; } //Optional sub group to be grouped in or NULL
        public string Url { get; set; }           //Base Url not including filter params
        public string LayerName { get; set; }     //WMS or WMTS layer name
        public string LegendLayerName { get; set; } //The name of a single layer that provides the map key       
        [JsonIgnore]
        public long LayerOrder { get; set; }           //Initial Order within the Layer Group (or SubLayerGroup)
        [JsonIgnore]
        public Boolean LayerVisible { get; set; }      //Initial Visibility
        [JsonIgnore]
        [Range(0.0f,1.0f)]
        public float LayerOpacity { get; set; }        //Initial Opacity
        [JsonIgnore]
        public double LayerCentreLon { get; set; }    //Layer specific Centre Longitude in EPSG:4326 (X) - overrides Map centre
        [JsonIgnore]
        public double LayerCentreLat { get; set; }    //Layer specific Centre Latitude in EPSG:4326 (Y) - overrides Map centre
        [JsonIgnore]
        public int LayerZoom { get; set; }        //Layer specific Zoom Level 1-22 - overrides Map zoom
        [JsonIgnore]
        public int LayerDefaultOrder { get; set; }        //Layer default (initial) ordering
        [JsonIgnore]
        public string LayerDownloadLayer { get; set; } //if the layer is actually a Layer Group in Geoserver then for download as shapefile we need a single layer name

        //foreign keys
        public long LayerGroupId { get; set; }    //which LayerGroup am I in?
        
        //not part of the schema, but part of the class - and what is sent in the JSON
        public LayerGroup LayerGroup { get; set; }
        public List<Filter> Filters { get; set; }
        [NotMapped]
        public long Order { get; set; }
        [NotMapped]
        public Boolean Visible { get; set; }
        [NotMapped]
        public float Opacity { get; set; }
        [NotMapped]
        public double[] Center { get; set; } = new double[2];       //what's actually sent in the JSON response (an array)
        [NotMapped]
        public int Zoom { get; set; } 
        [NotMapped]
        public int DefaultOrder { get; set; }
        [NotMapped]
        public string DownloadLayer { get; set; } 
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
        public Boolean IsComplex { get; set; }      //is this complex filter, using SQL view viewparams instead of OGC?
        public long Order { get; set; }             //filter order

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

    public class Gazetteer {
        [Key]
        public long GazetteerId { get; set; }   //unique Gazetteer ID
        public string Name { get; set; }        //PlaceName
        public string Category { get; set; }    //Gazetteer Category
        [JsonIgnore]
        public double Xmin { get; set; }        //Extent X Min
        [JsonIgnore]
        public double Ymin { get; set; }        //Extent Y Min
        [JsonIgnore]
        public double Xmax { get; set; }        //Extent X Max
        [JsonIgnore]
        public double Ymax { get; set; }        //Extent Y Max
        
        [NotMapped]
        public double[] Extent { get; set; } = new double[4]; //an array of coordinates for the extent

        [JsonIgnore]
        public Boolean Imported { get; set; }   //was this data imported from the spreadsheet?

    }
}