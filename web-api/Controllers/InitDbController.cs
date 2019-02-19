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
        public async Task<ActionResult<IEnumerable<MapInstance>>> GetMapInstances()
        {
            var bl1 = new BaseLayer { 
                Name = "OpenStreetMap",
                MetadataUrl = "http://openstreetmap.org",
                Type = "OSM",
                Url = "//{a-f}.osm.esdm.co.uk/osm/900913/c/{z}/{x}/{y}.png"
            };
            var bl2 = new BaseLayer { 
                Name = "OpenTopoMap",
                MetadataUrl = "http://opentopomap.org",
                Type = "OSM",
                Url = "//{a-f}.osm.esdm.co.uk/osm/900913/tc/{z}/{x}/{y}.png"
            };

            if (_context.BaseLayer.Count() == 0)
            {   // Create a new BaseLayer if collection is empty                
                _context.BaseLayer.Add(bl1);
                _context.SaveChanges();
                _context.BaseLayer.Add(bl2);
                _context.SaveChanges();
            }

            var map1 = new MapInstance { 
                Name = "EMODnet",
                Description = "<p>Configurable <strong>EMODnet</strong> description.</p><p><a href=\"http://www.emodnet.eu/\" target=\"_blank\">EMODnet</a></p>",
                MapCentre = "[-3.507729, 52.304535]",
                MapZoom = 6,
                BaseLayerList = "OpenStreetMap,OpenTopoMap",
                VisibleBaseLayer = "OpenStreetMap"
             };
            var map2 = new MapInstance { 
                Name = "OSPAR", 
                Description = "<p>Configurable <strong>OSPAR</strong> description.</p><p><a href=\"https://www.ospar.org/\" target=\"_blank\">OSPAR</a></p>",
                MapCentre = "[-3.507729, 52.304535]",
                MapZoom = 6,
                BaseLayerList = "OpenStreetMap,OpenTopoMap",
                VisibleBaseLayer = "OpenTopoMap"               
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

            //LayerGroups
            var layergroups = _context.LayerGroup.Where(f => f.Name.EndsWith("(Test)"));
            _context.LayerGroup.RemoveRange(layergroups);

            var lg1 = new LayerGroup { 
                MapInstanceId = map1.MapInstanceId,
                Name = "EMODnet broad-scale seabed habitat map for Europe (EUSeaMap) (Test)",
                Description = "<p>Collection of <strong>Layers</strong></p>",
                Order = 10
            };
            var lg2 = new LayerGroup { 
                MapInstanceId = map1.MapInstanceId,
                Name = "Environmental variables that influence habitat type (Test)",
                Description = "<p>Collection of <strong>Layers</strong></p>",
                Order = 20
            };
            var lg3 = new LayerGroup { 
                MapInstanceId = map2.MapInstanceId,
                Name = "Collection of Layers (Test)",
                Description = "<p>Collection of <strong>Layers</strong></p>"
            };
              
            _context.LayerGroup.Add(lg1);
            _context.SaveChanges();
            _context.LayerGroup.Add(lg2);
            _context.SaveChanges();
            _context.LayerGroup.Add(lg3);
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
                Type = "WMS",
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 1,
                LayerVisible = true,
                LayerOpacity = 0.8f,
                LayerCentre = "[-3.507729, 52.304535]",
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
                Type = "WMS",
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 11,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentre = "[-3.507729, 52.304535]",
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
                Type = "WMS",
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 12,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentre = "[-3.507729, 52.304535]",
                LayerZoom = 6
            };
            var l4 = new Layer { 
                LayerGroupId = lg1.LayerGroupId,
                LayerName = "eusm_sub",
                LegendLayerName = "eusm2016_subs_full",
                Name = "Substrate type (Test)",
                SubLayerGroup = "Classified habitat descriptors",
                MetadataUrl = "http://gis.ices.dk/geonetwork/srv/eng/catalog.search#/metadata/15adae05-99f0-4275-88c3-26d7908b9f0e",
                MetadataDescription = "Classified seabed substrate types for all European waters. One of several habitat descriptors used to determine the final habitat type. Based on the EMODnet Geology seabed substrate product.",
                DownloadURL = "http://www.emodnet-seabedhabitats.eu/access-data/download-data/?linkid=1",               
                Type = "WMS",
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 2,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentre = "[-3.507729, 52.304535]",
                LayerZoom = 6
            };

            var l5 = new Layer { 
                LayerGroupId = lg1.LayerGroupId,
                LayerName = "uksm2016",
                LegendLayerName = "uk3as",
                Name = "EUNIS classification for the UK shelf area at 3 arc-second resolution (Test)",
                SubLayerGroup = "Regional broad-scale seabed habitat maps",
                MetadataUrl = "",
                MetadataDescription = "Case-study in the use of the \"EUSeaMap\" model to drive a higher resolution three arc-second broad-scale habitat map for the UK shelf where sufficient data are available.",
                DownloadURL = "",               
                Type = "WMS",
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 21,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentre = "[-3.507729, 52.304535]",
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
                Type = "WMS",
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 21,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentre = "[-3.507729, 52.304535]",
                LayerZoom = 6
            };            
            var l7 = new Layer { 
                LayerGroupId = lg2.LayerGroupId,
                LayerName = "eusm_oxy",
                LegendLayerName = "eusm2016_oxy_full",
                Name = "EUSeaMap 2016 Oxygen Regime Group (Test)",
                SubLayerGroup = "Regional broad-scale seabed habitat maps",
                MetadataUrl = "#",
                MetadataDescription = "Decription",
                DownloadURL = "#",               
                Type = "WMS",
                Url=_webapiconfig.Value.TestDataWMSUrl,
                LayerOrder = 21,
                LayerVisible = false,
                LayerOpacity = 0.8f,
                LayerCentre = "[-3.507729, 52.304535]",
                LayerZoom = 6
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
                LookupCategory = "EunisHabitat"
            };
             
            _context.Filter.Add(f1);
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

            return await _context.MapInstance.ToListAsync();
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