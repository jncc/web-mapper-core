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
    public class MapController : Controller
    {
        private readonly MapConfigContext _context;

        public MapController(MapConfigContext context)
        {
            _context = context;

            var map1 = new MapInstance { Name = "EMODnet", Description = "<p>Configurable <strong>EMODnet</strong> description.</p><p><a href=\"http://www.emodnet.eu/\" target=\"_blank\">EMODnet</a></p>" };
            var map2 = new MapInstance { Name = "OSPAR", Description = "<p>Configurable <strong>OSPAR</strong> description.</p><p><a href=\"https://www.ospar.org/\" target=\"_blank\">OSPAR</a></p>" };           

            if (_context.MapInstance.Count() == 0)
            {
                // Create a new MapInstance if collection is empty                
                _context.MapInstance.Add(map1);
                _context.SaveChanges();                
                _context.MapInstance.Add(map2);
                _context.SaveChanges();
            }

            var lg1 = new LayerGroup { MapId = map1.MapId, Name = "Base Layers", Description = "<p>Collection of <strong>Baselayers</strong></p>"};
            var lg2 = new LayerGroup { MapId = map2.MapId, Name = "Base Layers", Description = "<p>Collection of <strong>Baselayers</strong></p>"};

            if (_context.LayerGroup.Count() == 0)
            {
                // Create a new LayerGroup if collection is empty                
                _context.LayerGroup.Add(lg1);
                _context.SaveChanges();
                _context.LayerGroup.Add(lg2);
                _context.SaveChanges();
            }

            var l1 = new Layer { LayerGroupId = lg1.LayerGroupId, Name = "OSM Layer", Description = "<p>Openstreetmap <strong>Baselayer</strong></p>", Order = 1, Type = "OSM", Src="//{a-f}.osm.esdm.co.uk/osm/900913/c/{z}/{x}/{y}.png", Visible = true, Opacity = 50, FilterDefinition = ""};
            var l2 = new Layer { LayerGroupId = lg2.LayerGroupId, Name = "OSM Layer", Description = "<p>Openstreetmap <strong>Baselayer</strong></p>", Order = 1, Type = "OSM", Src="//{a-f}.osm.esdm.co.uk/osm/900913/c/{z}/{x}/{y}.png", Visible = true, Opacity = 50, FilterDefinition = ""};
            if (_context.Layer.Count() == 0)
            {
                // Create a new Layer if collection is empty                
                _context.Layer.Add(l1);
                _context.SaveChanges();
                _context.Layer.Add(l2);
                _context.SaveChanges();
            }

            var f1 = new Filter { LayerId = l1.LayerId, Name = "Habitat Filter", Description = "<p>A Filter for <strong>Habitats</strong></p>", Type = "Lookup", Property = "habitat", LookupSrc="/api/Lookup/Habitat"};
            var f2 = new Filter { LayerId = l1.LayerId, Name = "Species Filter", Description = "<p>A Filter for <strong>Species</strong></p>", Type = "Lookup", Property = "species", LookupSrc="/api/Lookup/Species"};
            var f3 = new Filter { LayerId = l2.LayerId, Name = "Habitat Filter", Description = "<p>A Filter for <strong>Habitats</strong></p>", Type = "Lookup", Property = "habitat", LookupSrc="/api/Lookup/Habitat"};
            var f4 = new Filter { LayerId = l2.LayerId, Name = "Species Filter", Description = "<p>A Filter for <strong>Species</strong></p>", Type = "Lookup", Property = "species", LookupSrc="/api/Lookup/Species"};
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
        }

        // GET: api/Map
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MapInstance>>> GetMapInstances()
        {
            var maps = await _context.MapInstance.ToListAsync();
            return Json( new { mapInstances = maps });
        }

        // GET: api/Map/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MapInstance>> GetMapInstances(long id)
        {
            var map = await _context.MapInstance
                .Include(m => m.LayerGroups)
                .ThenInclude(l => l.Layers)
                .ThenInclude(f => f.Filters)
                .SingleOrDefaultAsync(i => i.MapId == id);        

            if (map == null)
            {
                return NotFound();
            }
            return Json( new { mapInstance = map });
        }

        private bool MapExists(long id)
        {
            return _context.MapInstance.Any(e => e.MapId == id);
        }
    }
}
