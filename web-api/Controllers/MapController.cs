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
        }

        // GET: api/Map
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MapInstance>>> GetMapInstances()
        {
            return await _context.MapInstances.ToListAsync();
        }

        // GET: api/Map/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MapInstance>> GetMapInstances(long id)
        {
            var map = await _context.MapInstances.FindAsync(id);

            if (map == null)
            {
                return NotFound();
            }
            return map;
        }



        private bool MapExists(long id)
        {
            return _context.MapInstances.Any(e => e.MapId == id);
        }
    }
}
