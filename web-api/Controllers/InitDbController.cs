using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Config.Options;
using MapConfig.Models;

namespace MapConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InitDbController : Controller
    {
        private readonly MapConfigContext _context;
        private readonly IOptions<WebApiConfig> _webapiconfig;
        public InitDbController(MapConfigContext context, IOptions<WebApiConfig> webapiconfig)
        {
            _context = context;
            _webapiconfig = webapiconfig;
        }

        // GET: api/InitDb
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MapInstance>>> InitDb()
        {

            //Additional BaseLayers
            var baselayer = _context.BaseLayer.Where(e =>e.Name.EndsWith("(Test)"));
            _context.BaseLayer.RemoveRange(baselayer);

            var bl1 = new BaseLayer { 
                Name = "World1 (Test)",
                Attribution = "Data derived from OpenStreetMap",
                AttributionUrl = "http://openstreetmap.org",
                Url = _webapiconfig.Value.TestDataWMSUrl,
                LayerName = "simplified_land_polygons"
            };
            var bl2 = new BaseLayer { 
                Name = "World2 (Test)",
                Attribution = "Data derived from OpenStreetMap",
                AttributionUrl = "http://openstreetmap.org",
                Url = _webapiconfig.Value.TestDataWMSUrl,
                LayerName = "simplified_land_polygons_alt"
            };

            _context.BaseLayer.Add(bl1);
            _context.SaveChanges();
            _context.BaseLayer.Add(bl2);
            _context.SaveChanges();

            var map1 = new MapInstance { 
                Name = "EMODnet",
                Attribution = "Map Provided by JNCC",
                Description = "<p>Configurable <strong>EMODnet</strong> description.</p><p><a href=\"http://www.emodnet.eu/\" target=\"_blank\">EMODnet</a></p>",
                MapCentreLon = -3.507729,
                MapCentreLat = 52.304535,
                MapZoom = 6,
                MaxZoom = 18,
                BaseLayerList = "World1 (Test),World2 (Test)",
                VisibleBaseLayer = "World2 (Test)"
             };
            var map2 = new MapInstance { 
                Name = "OSPAR",
                Attribution = "Map Provided by JNCC",
                Description = "<p>Configurable <strong>OSPAR</strong> description.</p><p><a href=\"https://www.ospar.org/\" target=\"_blank\">OSPAR</a></p>",
                MapCentreLon = -3.507729,
                MapCentreLat = 52.304535,
                MapZoom = 6,
                MaxZoom = 18,
                BaseLayerList = "World1 (Test),World2 (Test)",
                VisibleBaseLayer = "World2 (Test)"              
            };           

            if (_context.MapInstance.Count() == 0)
            {
                // Create a new MapInstance if collection is empty                
                _context.MapInstance.Add(map1);
                _context.SaveChanges();                
                _context.MapInstance.Add(map2);
                _context.SaveChanges();
            }
            else
            {
                 map1 = await _context.MapInstance
                    .SingleOrDefaultAsync(m => m.Name == "EMODnet");
                 map2 = await _context.MapInstance
                    .SingleOrDefaultAsync(m => m.Name == "OSPAR");
            }

            //External WMS Sources
            var externalwms = _context.ExternalWmsUrl.Where(e =>e.Name.EndsWith("(Test)"));
            _context.ExternalWmsUrl.RemoveRange(externalwms);

            var ew1 = new ExternalWmsUrl {
                MapInstanceId = map1.MapInstanceId,
                Name = "EMODnet Biology (Test)",
                Description = "EMODnet Biology",
                Url = "http://geo.vliz.be/geoserver/wms"
            };
            var ew2 = new ExternalWmsUrl {
                MapInstanceId = map1.MapInstanceId,
                Name = "EMODnet Geology (Test)",
                Description = "EMODnet Geology",
                Url = "http://drive.emodnet-geology.eu/geoserver/EMODnetGeology/wms"
            };
            var ew3 = new ExternalWmsUrl {
                MapInstanceId = map1.MapInstanceId,
                Name = "EMODnet Human Activities (Test)",
                Description = "EMODnet Human Activities",
                Url = "http://77.246.172.208/geoserver/emodnet/wms"
            };

            _context.ExternalWmsUrl.Add(ew1);
            _context.SaveChanges();
            _context.ExternalWmsUrl.Add(ew2);
            _context.SaveChanges();
            _context.ExternalWmsUrl.Add(ew3);
            _context.SaveChanges();

            //LayerGroups
            var layergroups = _context.LayerGroup.Where(f => f.Name.EndsWith("(Test)"));
            _context.LayerGroup.RemoveRange(layergroups);

            var lg1 = new LayerGroup { 
                MapInstanceId = map1.MapInstanceId,
                Name = "EMODnet broad-scale seabed habitat map for Europe (EUSeaMap) (Test)",
                Description = "<p>Collection of <strong>Layers</strong></p>",
                Order = 10,
                IsExternal = false
            };
            var lg2 = new LayerGroup { 
                MapInstanceId = map1.MapInstanceId,
                Name = "Environmental variables that influence habitat type (Test)",
                Description = "<p>Collection of <strong>Layers</strong></p>",
                Order = 20,
                IsExternal = false
            };
            var lg3 = new LayerGroup { 
                MapInstanceId = map1.MapInstanceId,
                Name = "Collection of Layers (Test)",
                Description = "<p>Collection of <strong>Layers</strong></p>",
                Order = 30,
                IsExternal = false
            };
            var lg4 = new LayerGroup { 
                MapInstanceId = map1.MapInstanceId,
                Name = "External Layers (Test)",
                Description = "<p>Add Layers from <strong>External Sources</strong></p>",
                Order = 999,
                IsExternal = true
            };
              
            _context.LayerGroup.Add(lg1);
            _context.SaveChanges();
            _context.LayerGroup.Add(lg2);
            _context.SaveChanges();
            _context.LayerGroup.Add(lg3);
            _context.SaveChanges();
            _context.LayerGroup.Add(lg4);
            _context.SaveChanges();

            //Layers
            var layers = _context.Layer.Where(f => f.Name.EndsWith("(Test)"));
            _context.Layer.RemoveRange(layers);

            var l1 = new Layer { 
                LayerGroupId = lg1.LayerGroupId,
                LayerName = "eusm2016",
                LegendLayerName = "eusm2016_full",
                Name = "EUNIS/full-detail habitat classification (Test)",
                MetadataUrl = "http://gis.ices.dk/geonetwork/srv/eng/catalog.search#/metadata/02a444c8-bd2d-4e15-8e69-806059103760",
                MetadataDescription = "Broad-scale seabed habitat map for all European waters. Classified in EUNIS classification system, except where translation is not possible.",
                DownloadURL = "http://www.emodnet-seabedhabitats.eu/access-data/download-data/?linkid=1",
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 10,
                LayerVisible = true,
                LayerOpacity = 0.8f,
                LayerCentreLon = -3.507729,
                LayerCentreLat = 52.304535,
                LayerZoom = 6
            };
            var l2 = new Layer { 
                LayerGroupId = lg1.LayerGroupId,
                LayerName = "eusm_msfd",
                LegendLayerName = "eusm2016_msfd_full",
                Name = "MSFD Benthic Broad Habitat Types (Test)",
                MetadataUrl = "http://gis.ices.dk/geonetwork/srv/eng/catalog.search#/metadata/d23d0516-6ff4-4fb8-bf78-c11991cef78b",
                MetadataDescription = "Broad-scale seabed habitat map for all European waters. Classified into Marine Strategy Framework Directive Benthic Broad Habitat Types.",
                DownloadURL = "http://www.emodnet-seabedhabitats.eu/access-data/download-data/?linkid=1",               
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 11,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentreLon = -3.507729,
                LayerCentreLat = 52.304535,
                LayerZoom = 6                
            };

            var l3 = new Layer { 
                LayerGroupId = lg1.LayerGroupId,
                LayerName = "eusm_bio",
                LegendLayerName = "eusm2016_bio_full",
                Name = "Substrate type (Test)",
                SubLayerGroup = "Classified habitat descriptors",
                MetadataUrl = "http://gis.ices.dk/geonetwork/srv/eng/catalog.search#/metadata/ad20fbc7-37d4-40b5-a246-8cdb321e4654",
                MetadataDescription = "Classified biological zones for all European waters. One of several habitat descriptors used to determine the final habitat type.",
                DownloadURL = "http://www.emodnet-seabedhabitats.eu/access-data/download-data/?linkid=1",               
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 12,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentreLon = -3.507729,
                LayerCentreLat = 52.304535,
                LayerZoom = 6
            };
            var l4 = new Layer { 
                LayerGroupId = lg2.LayerGroupId,
                LayerName = "eusm_sub",
                LegendLayerName = "eusm2016_subs_full",
                Name = "Substrate type (Test)",
                SubLayerGroup = "Classified habitat descriptors",
                MetadataUrl = "http://gis.ices.dk/geonetwork/srv/eng/catalog.search#/metadata/15adae05-99f0-4275-88c3-26d7908b9f0e",
                MetadataDescription = "Classified seabed substrate types for all European waters. One of several habitat descriptors used to determine the final habitat type. Based on the EMODnet Geology seabed substrate product.",
                DownloadURL = "http://www.emodnet-seabedhabitats.eu/access-data/download-data/?linkid=1",               
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 13,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentreLon = -3.507729,
                LayerCentreLat = 52.304535,
                LayerZoom = 6
            };

            var l5 = new Layer { 
                LayerGroupId = lg3.LayerGroupId,
                LayerName = "uksm2016",
                LegendLayerName = "uk3as",
                Name = "EUNIS classification for the UK shelf area at 3 arc-second resolution (Test)",
                SubLayerGroup = "Regional broad-scale seabed habitat maps",
                MetadataUrl = "",
                MetadataDescription = "Case-study in the use of the \"EUSeaMap\" model to drive a higher resolution three arc-second broad-scale habitat map for the UK shelf where sufficient data are available.",
                DownloadURL = "",               
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 21,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentreLon = -3.507729,
                LayerCentreLat = 52.304535,
                LayerZoom = 6
            };
            //
            var l6 = new Layer { 
                LayerGroupId = lg2.LayerGroupId,
                LayerName = "eusm_oxy",
                LegendLayerName = "eusm2016_oxy_full",
                Name = "EUSeaMap 2016 Oxygen Regime Group (Test)",
                SubLayerGroup = "Regional broad-scale seabed habitat maps",
                MetadataUrl = "#",
                MetadataDescription = "Description",
                DownloadURL = "#",               
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 21,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentreLon = 36,
                LayerCentreLat = 43,
                LayerZoom = 7
            };            
            var l7 = new Layer { 
                LayerGroupId = lg3.LayerGroupId,
                LayerName = "Test",
                LegendLayerName = "eusm2016_full",
                Name = "Test Layer with Complex Filters (Test)",
                SubLayerGroup = "",
                MetadataUrl = "http://gis.ices.dk/geonetwork/srv/eng/catalog.search#/metadata/02a444c8-bd2d-4e15-8e69-806059103760",
                MetadataDescription = "Broad-scale seabed habitat map for all European waters. Classified in EUNIS classification system, except where translation is not possible.",
                DownloadURL = "http://www.emodnet-seabedhabitats.eu/access-data/download-data/?linkid=1",               
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 22,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentreLon = 36,
                LayerCentreLat = 43,
                LayerZoom = 7
            };
            var l8 = new Layer { 
                LayerGroupId = lg3.LayerGroupId,
                LayerName = "Test1",
                LegendLayerName = "eusm2016_full",
                Name = "Test Layer with Complex Filters(2) (Test)",
                SubLayerGroup = "",
                MetadataUrl = "http://gis.ices.dk/geonetwork/srv/eng/catalog.search#/metadata/02a444c8-bd2d-4e15-8e69-806059103760",
                MetadataDescription = "Broad-scale seabed habitat map for all European waters. Classified in EUNIS classification system, except where translation is not possible.",
                DownloadURL = "http://www.emodnet-seabedhabitats.eu/access-data/download-data/?linkid=1",               
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 23,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentreLon = 37,
                LayerCentreLat = 44,
                LayerZoom = 7
            };

            var l9 = new Layer { 
                LayerGroupId = lg4.LayerGroupId,
                LayerName = "lighthouses",
                LegendLayerName = "lighthouses",
                Name = "EMODnet Human Activity - Lighthouses (Test)",
                SubLayerGroup = "",
                MetadataUrl = "",
                MetadataDescription = "",
                DownloadURL = "",               
                Url = "http://geo.vliz.be/geoserver/wms?version=1.1.1",
                LayerOrder = 1,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentreLon = 37,
                LayerCentreLat = 44,
                LayerZoom = 7
            };
               
            _context.Layer.Add(l1);
            _context.SaveChanges();
            _context.Layer.Add(l2);
            _context.SaveChanges();
            _context.Layer.Add(l3);
            _context.SaveChanges();
            _context.Layer.Add(l4);
            _context.SaveChanges();
            _context.Layer.Add(l5);
            _context.SaveChanges();
            _context.Layer.Add(l6);
            _context.SaveChanges();
            _context.Layer.Add(l7);
            _context.SaveChanges();
            _context.Layer.Add(l8);
            _context.SaveChanges();
            _context.Layer.Add(l9);
            _context.SaveChanges();

            //Filters
            var filters = _context.Filter.Where(f => f.Name.EndsWith("(Test)"));
            _context.Filter.RemoveRange(filters);

            var f1 = new Filter { 
                LayerId = l1.LayerId, 
                Name = "Eunis Habitat (Test)", 
                Description = "<p>Filter by <strong>Eunis</strong> Habitat Classifications</p>",
                MetadataUrl = "",
                Type = "Lookup", 
                Attribute = "hab_type", 
                LookupCategory = "EunisHabitats"
            };

            var f2 = new Filter { 
                LayerId = l2.LayerId, 
                Name = "Eunis Habitat (Test)", 
                Description = "<p>Filter by <strong>Eunis</strong> Habitat Classifications</p>",
                MetadataUrl = "",
                Type = "Lookup", 
                Attribute = "hab_type", 
                LookupCategory = "EunisHabitats"
            };
            var f3 = new Filter { 
                LayerId = l2.LayerId, 
                Name = "Ospar Habitat (Test)", 
                Description = "<p>Filter by <strong>Ospar</strong> Habitat Classifications</p>",
                MetadataUrl = "",
                Type = "Lookup", 
                Attribute = "hab_type", 
                LookupCategory = "OsparHabitats"
            };            
            var f4 = new Filter { 
                LayerId = l2.LayerId, 
                Name = "Habitat (Test)", 
                Description = "<p>Filter by Habitat Classifications</p>",
                MetadataUrl = "",
                Type = "Lookup", 
                Attribute = "habitat", 
                LookupCategory = "Habitat"
            };

            var f5 = new Filter { 
                LayerId = l7.LayerId, 
                Name = "Habitat (Test)", 
                Description = "<p>Filter by Habitat Classifications</p>",
                MetadataUrl = "",
                Type = "Lookup", 
                Attribute = "code", 
                LookupCategory = "EunisHabitats",
                IsComplex = true
            };
            var f6 = new Filter { 
                LayerId = l7.LayerId, 
                Name = "Habitat Code (Test)", 
                Description = "<p>Filter by Habitat Classifications</p>",
                MetadataUrl = "",
                Type = "Text", 
                Attribute = "code", 
                IsComplex = true
            };

            var f7 = new Filter { 
                LayerId = l5.LayerId, 
                Name = "Species (Test)", 
                Description = "<p>Filter by Species Classifications</p>",
                MetadataUrl = "",
                Type = "Lookup", 
                Attribute = "species", 
                LookupCategory = "Species"
            };
            var f8 = new Filter { 
                LayerId = l5.LayerId, 
                Name = "Habitat (Test)", 
                Description = "<p>Filter by Habitat Classifications</p>",
                MetadataUrl = "",
                Type = "Lookup", 
                Attribute = "habitat", 
                LookupCategory = "Habitat"
            };

            var f9 = new Filter { 
                LayerId = l8.LayerId, 
                Name = "Habitat (Test)", 
                Description = "<p>Filter by Habitat Classifications</p>",
                MetadataUrl = "",
                Type = "Lookup", 
                Attribute = "code", 
                LookupCategory = "EunisHabitats",
                IsComplex = true
            };
            var f10 = new Filter { 
                LayerId = l8.LayerId, 
                Name = "Substrate (Test)", 
                Description = "<p>Filter by Substrate</p>",
                MetadataUrl = "",
                Type = "Text", 
                Attribute = "substrate", 
                IsComplex = true
            };
             
            _context.Filter.Add(f1);
            _context.SaveChanges();
            _context.Filter.Add(f2);
            _context.SaveChanges();
            _context.Filter.Add(f3);
            _context.SaveChanges();
            _context.Filter.Add(f4);
            _context.SaveChanges();
            _context.Filter.Add(f5);
            _context.SaveChanges();
            _context.Filter.Add(f6);
            _context.SaveChanges();
            _context.Filter.Add(f7);
            _context.SaveChanges();
            _context.Filter.Add(f8);
            _context.SaveChanges();
            _context.Filter.Add(f9);
            _context.SaveChanges();
            _context.Filter.Add(f10);
            _context.SaveChanges();

            //Lookups (from JSON files)
            string json;
            IEnumerable<JToken> resultObjects;
            IQueryable<Lookup> habitats;

            habitats = _context.Lookup.Where(l => l.LookupCategory == "EunisHabitats");
            _context.Lookup.RemoveRange(habitats);

            json = System.IO.File.ReadAllText(@"TestData/EunisHabitats.json");
            resultObjects = AllChildren(JObject.Parse(json))
                .First(c => c.Type == JTokenType.Array && c.Path.Contains("d"))
                .Children<JObject>();
            
            foreach (JObject result in resultObjects) {
                var hb = new Lookup { LookupCategory = "EunisHabitats" };
                foreach (JProperty property in result.Properties()) {
                    // do something with the property belonging to result                    
                    if(property.Name=="Code") hb.Code=property.Value.ToString();
                    if(property.Name=="Description") hb.Name=property.Value.ToString();                
                }
                _context.Lookup.Add(hb);
                _context.SaveChanges();
            }

            habitats = _context.Lookup.Where(l => l.LookupCategory == "OsparHabitats");
            _context.Lookup.RemoveRange(habitats);

            json = System.IO.File.ReadAllText(@"TestData/OsparHabitats.json");
            resultObjects = AllChildren(JObject.Parse(json))
                .First(c => c.Type == JTokenType.Array && c.Path.Contains("d"))
                .Children<JObject>();

            foreach (JObject result in resultObjects) {
                var hb = new Lookup { LookupCategory = "OsparHabitats" };
                foreach (JProperty property in result.Properties()) {
                    // do something with the property belonging to result
                    if(property.Name=="Code") hb.Code=property.Value.ToString();
                    if(property.Name=="Description") hb.Name=property.Value.ToString();
                }
                _context.Lookup.Add(hb);
                _context.SaveChanges();
            }

            //Gazetteer
            var gazetteer = _context.Gazetteer.Where(g => g.Name.EndsWith("(Test)"));
            _context.Gazetteer.RemoveRange(gazetteer);
            var ge1= new Gazetteer { Name = "Rhayader (Test)", Category = "Test", Xmin=-3.9021790028, Ymin=52.1505680545, Xmax=-3.1489288807, Ymax=52.4495366603, Imported=false };
            var ge2= new Gazetteer { Name = "Brecon (Test)", Category = "Test", Xmin=-3.6007416248, Ymin=51.8500024602, Xmax=-3.1523621082, Ymax=51.9999034172, Imported=false };
            var ge3= new Gazetteer { Name = "Newtown (Test)", Category = "Test", Xmin=-3.6476644545, Ymin=52.3323769212, Xmax=-2.9740652114, Ymax=52.6372051526, Imported=false };

            _context.Gazetteer.Add(ge1);
            _context.SaveChanges();
            _context.Gazetteer.Add(ge2);
            _context.SaveChanges();
            _context.Gazetteer.Add(ge3);
            _context.SaveChanges();

            return Json ( new { result = "success" });
        }

        // recursively yield all children of json
        private static IEnumerable<JToken> AllChildren(JToken json)
        {
            foreach (var c in json.Children()) {
                yield return c;
                foreach (var cc in AllChildren(c)) {
                    yield return cc;
                }
            }
        }


    }

    public class HabitatFilter {
        public string __type { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
    }
}