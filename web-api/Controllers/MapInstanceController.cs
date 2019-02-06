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
    public class MapInstanceController : Controller
    {
        private readonly MapConfigContext _context;

        public MapInstanceController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/Map
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MapInstance>>> GetMapInstances()
        {
            var maps = await _context.MapInstance
                .Select(l => new { l.MapInstanceId, l.Name, l.Description })
                .ToListAsync();
            return Json( new { mapInstances = maps });
        }

        // GET: api/Map/Test
        [HttpGet("{name}")]
        public async Task<ActionResult<MapInstance>> GetMapInstances(string name)
        {
            var map = await _context.MapInstance
                .Include(m => m.LayerGroups)
                .ThenInclude(l => l.Layers)
                .ThenInclude(f => f.Filters)
                .SingleOrDefaultAsync(m => m.Name.ToUpper() == name.ToUpper());        

            if (map == null)
            {
                return NotFound();
            }

            List<BaseLayer> baseLayers = new List<BaseLayer>();
            //split the list of BaseLayer Names or Ids into an array and remove leading and trailing spaces
            var baseLayersList = map.BaseLayerList
                .Split(",")
                .Select(e => e.Trim())
                .Distinct();
            
            if(baseLayersList.Count()>0) {
                foreach(string baseLayerName in baseLayersList) {
                    BaseLayer baseLayer;
                    try { //try Ids
                        uint baseLayerId = Convert.ToUInt32(baseLayerName, 10);
                        baseLayer = await _context.BaseLayer
                            .SingleOrDefaultAsync(b => b.BaseLayerId == baseLayerId);
                    } catch { //or Names
                        baseLayer = await _context.BaseLayer
                            .SingleOrDefaultAsync(b => b.Name == baseLayerName);
                    }
                    if(baseLayer.BaseLayerId > 0) { //we found the baselayer
                        baseLayer.Visible=false;
                        try { //is it marked visible by Id?
                            uint visibleLayerId = Convert.ToUInt32(map.VisibleBaseLayer, 10);
                            if(visibleLayerId == baseLayer.BaseLayerId) baseLayer.Visible=true;                  
                        } catch { //or by Name?
                            if(map.VisibleBaseLayer == baseLayer.Name) baseLayer.Visible=true;
                        }
                        baseLayers.Add(baseLayer);
                    }
                }
                map.BaseLayers = baseLayers;
            }

            return Json( map );
        }

        private bool MapExists(string name)
        {
            return _context.MapInstance.Any(m => m.Name == name);
        }
    }
}