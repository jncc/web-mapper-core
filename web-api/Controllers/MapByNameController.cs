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
            var maps = await _context.MapInstance.ToListAsync();
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
            return Json( new { mapInstance = map });
        }

        private bool MapExists(string name)
        {
            return _context.MapInstance.Any(m => m.Name == name);
        }
    }
}