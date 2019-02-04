using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace MapConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InitDbController : Controller
    {
        private readonly MapConfigContext _context;

        public InitDbController(MapConfigContext context)
        {
            _context = context;
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
                Centre = "[-3.507729, 52.304535]",
                Zoom = 6,
                BaseLayerList = "OpenStreetMap,OpenTopoMap",
                VisibleBaseLayer = "OpenStreetMap"
             };
            var map2 = new MapInstance { 
                Name = "OSPAR", 
                Description = "<p>Configurable <strong>OSPAR</strong> description.</p><p><a href=\"https://www.ospar.org/\" target=\"_blank\">OSPAR</a></p>",
                Centre = "[-3.507729, 52.304535]",
                Zoom = 6,
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

            var lg1 = new LayerGroup { 
                MapInstanceId = map1.MapInstanceId,
                Name = "EMODnet broad-scale seabed habitat map for Europe (EUSeaMap)",
                Description = "<p>Collection of <strong>Layers</strong></p>",
                Order = 10
            };
            var lg2 = new LayerGroup { 
                MapInstanceId = map1.MapInstanceId,
                Name = "Environmental variables that influence habitat type",
                Description = "<p>Collection of <strong>Layers</strong></p>",
                Order = 20
            };
            var lg3 = new LayerGroup { 
                MapInstanceId = map2.MapInstanceId,
                Name = "Collection of Layers",
                Description = "<p>Collection of <strong>Layers</strong></p>"
            };

            if (_context.LayerGroup.Count() == 0)
            {
                // Create a new LayerGroup if collection is empty                
                _context.LayerGroup.Add(lg1);
                _context.SaveChanges();
                _context.LayerGroup.Add(lg2);
                _context.SaveChanges();
                _context.LayerGroup.Add(lg3);
                _context.SaveChanges();
            }

            var l1 = new Layer { 
                LayerGroupId = lg1.LayerGroupId,
                LayerName = "eusm2016",
                Name = "EUNIS/full-detail habitat classification",
                MetadataUrl = "http://gis.ices.dk/geonetwork/srv/eng/catalog.search#/metadata/02a444c8-bd2d-4e15-8e69-806059103760",
                MetadataDescription = "Broad-scale seabed habitat map for all European waters. Classified in EUNIS classification system, except where translation is not possible.",
                DownloadURL = "http://www.emodnet-seabedhabitats.eu/access-data/download-data/?linkid=1",
                Type = "WMS",
                Url="//jnccdev-geo.esdm.co.uk/emodnet/wms",
                Order = 1,
                Visible = true,
                Opacity = 0.5f,
                Centre = "[-3.507729, 52.304535]",
                Zoom = 6
            };
            var l2 = new Layer { 
                LayerGroupId = lg1.LayerGroupId,
                LayerName = "eusm_msfd",
                Name = "MSFD Benthic Broad Habitat Types",
                MetadataUrl = "http://gis.ices.dk/geonetwork/srv/eng/catalog.search#/metadata/d23d0516-6ff4-4fb8-bf78-c11991cef78b",
                MetadataDescription = "Broad-scale seabed habitat map for all European waters. Classified into Marine Strategy Framework Directive Benthic Broad Habitat Types.",
                DownloadURL = "http://www.emodnet-seabedhabitats.eu/access-data/download-data/?linkid=1",               
                Type = "WMS",
                Url="//jnccdev-geo.esdm.co.uk/emodnet/wms",
                Order = 11,
                Visible = true,
                Opacity = 0.5f,
                Centre = "[-3.507729, 52.304535]",
                Zoom = 6                
            };

            var l3 = new Layer { 
                LayerGroupId = lg1.LayerGroupId,
                LayerName = "eusm_bio",
                Name = "Substrate type",
                SubLayerGroup = "Classified habitat descriptors",
                MetadataUrl = "http://gis.ices.dk/geonetwork/srv/eng/catalog.search#/metadata/ad20fbc7-37d4-40b5-a246-8cdb321e4654",
                MetadataDescription = "Classified biological zones for all European waters. One of several habitat descriptors used to determine the final habitat type.",
                DownloadURL = "http://www.emodnet-seabedhabitats.eu/access-data/download-data/?linkid=1",               
                Type = "WMS",
                Url="//jnccdev-geo.esdm.co.uk/emodnet/wms",
                Order = 12,
                Visible = true,
                Opacity = 0.5f,
                Centre = "[-3.507729, 52.304535]",
                Zoom = 6
            };
            var l4 = new Layer { 
                LayerGroupId = lg1.LayerGroupId,
                LayerName = "eusm_sub",
                Name = "Substrate type",
                SubLayerGroup = "Classified habitat descriptors",
                MetadataUrl = "http://gis.ices.dk/geonetwork/srv/eng/catalog.search#/metadata/15adae05-99f0-4275-88c3-26d7908b9f0e",
                MetadataDescription = "Classified seabed substrate types for all European waters. One of several habitat descriptors used to determine the final habitat type. Based on the EMODnet Geology seabed substrate product.",
                DownloadURL = "http://www.emodnet-seabedhabitats.eu/access-data/download-data/?linkid=1",               
                Type = "WMS",
                Url="//jnccdev-geo.esdm.co.uk/emodnet/wms",
                Order = 2,
                Visible = true,
                Opacity = 0.5f,
                Centre = "[-3.507729, 52.304535]",
                Zoom = 6
            };

            var l5 = new Layer { 
                LayerGroupId = lg1.LayerGroupId,
                LayerName = "uksm2016",
                Name = "EUNIS classification for the UK shelf area at 3 arc-second resolution",
                SubLayerGroup = "Regional broad-scale seabed habitat maps",
                MetadataUrl = "",
                MetadataDescription = "Case-study in the use of the \"EUSeaMap\" model to drive a higher resolution three arc-second broad-scale habitat map for the UK shelf where sufficient data are available.",
                DownloadURL = "",               
                Type = "WMS",
                Url="//jnccdev-geo.esdm.co.uk/emodnet/wms",
                Order = 21,
                Visible = true,
                Opacity = 0.5f,
                Centre = "[-3.507729, 52.304535]",
                Zoom = 6
            };
            //
            var l6 = new Layer { 
                LayerGroupId = lg2.LayerGroupId,
                LayerName = "eusm_oxy",
                Name = "Another Layer 1",
                SubLayerGroup = "Regional broad-scale seabed habitat maps",
                MetadataUrl = "#",
                MetadataDescription = "Decription",
                DownloadURL = "#",               
                Type = "WMS",
                Url="//jnccdev-geo.esdm.co.uk/emodnet/wms",
                Order = 21,
                Visible = true,
                Opacity = 0.5f,
                Centre = "[-3.507729, 52.304535]",
                Zoom = 6
            };            
            var l7 = new Layer { 
                LayerGroupId = lg2.LayerGroupId,
                LayerName = "eusm_oxy",
                Name = "Another Layer 2",
                SubLayerGroup = "Regional broad-scale seabed habitat maps",
                MetadataUrl = "#",
                MetadataDescription = "Decription",
                DownloadURL = "#",               
                Type = "WMS",
                Url="//jnccdev-geo.esdm.co.uk/emodnet/wms",
                Order = 21,
                Visible = true,
                Opacity = 0.5f,
                Centre = "[-3.507729, 52.304535]",
                Zoom = 6
            }; 

            if (_context.Layer.Count() == 0)
            {
                // Create a new Layer if collection is empty                
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
            }

            var f1 = new Filter { 
                LayerId = l1.LayerId, 
                Name = "Habitat Filter", 
                Description = "<p>A Filter for <strong>Habitats</strong></p>",
                MetadataUrl = "",
                Type = "Lookup", 
                Attribute = "habitat", 
                LookupCategory = "Habitat"
            };
            var f2 = new Filter { 
                LayerId = l1.LayerId, 
                Name = "Species Filter", 
                Description = "<p>A Filter for <strong>Species</strong></p>",
                MetadataUrl = "",
                Type = "Lookup", 
                Attribute = "species", 
                LookupCategory = "Species"
            };
            var f3 = new Filter { 
                LayerId = l2.LayerId, 
                Name = "Habitat Filter", 
                Description = "<p>A Filter for <strong>Habitats</strong></p>",
                MetadataUrl = "",
                Type = "Lookup", 
                Attribute = "habitat", 
                LookupCategory = "Habitat"
            };
            var f4 = new Filter { 
                LayerId = l3.LayerId, 
                Name = "Species Filter", 
                Description = "<p>A Filter for <strong>Species</strong></p>",
                MetadataUrl = "",
                Type = "Lookup", 
                Attribute = "species", 
                LookupCategory = "Species"
            };

            if (_context.Filter.Count() == 0)
            {
                // Create a new Filter if collection is empty                
                _context.Filter.Add(f1);
                _context.SaveChanges();
                _context.Filter.Add(f2);
                _context.SaveChanges();
                _context.Filter.Add(f3);
                _context.SaveChanges();
                _context.Filter.Add(f4);
                _context.SaveChanges();
            }

            if (_context.Lookup.Count() == 0)
            {
                uint i;
                for(i=0;i<6;i++) {
                    var lk = new Lookup {
                        Code = "SP" + i,
                        Name = "Species " + i,
                        LookupCategory = "Species"
                    };
                    _context.Lookup.Add(lk);
                    _context.SaveChanges();
                }
                for(i=0;i<6;i++) {
                    var hb = new Lookup {
                        Code = "HB" + i,
                        Name = "Habitat " + i,
                        LookupCategory = "Habitat"
                    };
                    _context.Lookup.Add(hb);
                    _context.SaveChanges();
                }
            }
            return await _context.MapInstance.ToListAsync();
        }
    }
}