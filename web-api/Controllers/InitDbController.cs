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
                Url = "//{a-f}.osm.esdm.co.uk/osm/900913/c/{z}/{x}/{y}.png",
                Visible = true 
            };
            var bl2 = new BaseLayer { 
                Name = "OpenTopoMap",
                MetadataUrl = "http://opentopomap.org",
                Type = "OSM",
                Url = "//{a-f}.osm.esdm.co.uk/osm/900913/tc/{z}/{x}/{y}.png",
                Visible = true 
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
                Centre = "[52,-3]",
                Zoom = 6,
                BaseLayerList = "OpenStreetMap,OpenTopoMap"
             };
            var map2 = new MapInstance { 
                Name = "OSPAR", 
                Description = "<p>Configurable <strong>OSPAR</strong> description.</p><p><a href=\"https://www.ospar.org/\" target=\"_blank\">OSPAR</a></p>",
                Centre = "[52,-3]",
                Zoom = 6,
                BaseLayerList = "OpenStreetMap,OpenTopoMap"                
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
                Name = "Collection of Layers",
                Description = "<p>Collection of <strong>Layers</strong></p>"
            };
            var lg2 = new LayerGroup { 
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
            }

            var l1 = new Layer { 
                LayerGroupId = lg1.LayerGroupId,
                Name = "Overlay Layer 1",
                Description = "<p>An Overlay Layer</p>",               
                Type = "WMS",
                Url="",
                Order = 1,
                Visible = true,
                Opacity = 0.5f
            };
            var l2 = new Layer { 
                LayerGroupId = lg1.LayerGroupId,
                Name = "Overlay Layer 2",
                Description = "<p>An Overlay Layer</p>",               
                Type = "WMS",
                Url="",
                Order = 2,
                Visible = true,
                Opacity = 0.5f
            };
            var l3 = new Layer { 
                LayerGroupId = lg2.LayerGroupId,
                Name = "Overlay Layer 3",
                Description = "<p>An Overlay Layer</p>",               
                Type = "WMS",
                Url="",
                Order = 1,
                Visible = true,
                Opacity = 0.5f
            };
            var l4 = new Layer { 
                LayerGroupId = lg2.LayerGroupId,
                Name = "Overlay Layer 4",
                Description = "<p>An Overlay Layer</p>",               
                Type = "WMS",
                Url="",
                Order = 2,
                Visible = true,
                Opacity = 0.5f
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