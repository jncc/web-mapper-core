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
    public class MapByNameController : Controller
    {
        private readonly MapConfigContext _context;

        public MapByNameController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/MapByName
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MapInstance>>> GetMapInstances()
        {
            var maps = await _context.MapInstance
                .Select(l => new { l.MapInstanceId, l.Name, l.Description })
                .ToListAsync();
            return Json( new { mapInstances = maps });
        }

        // GET: api/MapByName/Test
        [HttpGet("{name}")]
        public async Task<ActionResult<MapInstance>> GetMapInstances(string name)
        {
            var map = await _context.MapInstance
                .Include(m => m.LayerGroups)
                .ThenInclude(l => l.Layers)
                .ThenInclude(f => f.Filters)
                .SingleOrDefaultAsync(m => m.Name == name);        

            if (map == null)
            {
                return NotFound();
            }

            List<BaseLayer> baseLayers = new List<BaseLayer>();

            var baseLayersList = map.BaseLayerList
                .Split(",")
                .Select(e => e.Trim())
                .Distinct();
            
            if(baseLayersList.Count()>0) {
                foreach(string baseLayerName in baseLayersList) {
                    BaseLayer baseLayer;
                    try {
                        uint baseLayerId = Convert.ToUInt32(baseLayerName, 10);
                        baseLayer = await _context.BaseLayer
                            .SingleOrDefaultAsync(b => b.BaseLayerId == baseLayerId);
                    } catch {
                        baseLayer = await _context.BaseLayer
                            .SingleOrDefaultAsync(b => b.Name == baseLayerName);
                    }
                    if(baseLayer.BaseLayerId > 0) {
                        baseLayers.Add(baseLayer);
                    }
                }
                map.BaseLayers = baseLayers;
            }

            return Json( new { mapInstance = map });
        }

        private bool MapExists(string name)
        {
            return _context.MapInstance.Any(m => m.Name == name);
        }
    }
}