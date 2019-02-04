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
    public class MapInstanceOldController : ControllerBase
    {
        private readonly MapConfigContext _context;

        public MapInstanceOldController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/MapInstance
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MapInstance>>> GetMapInstance()
        {
            return await _context.MapInstance.ToListAsync();
        }

        // GET: api/MapInstance/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MapInstance>> GetMapInstance(long id)
        {
            var mapInstance = await _context.MapInstance.FindAsync(id);

            if (mapInstance == null)
            {
                return NotFound();
            }

            return mapInstance;
        }

        // PUT: api/MapInstance/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMapInstance(long id, MapInstance mapInstance)
        {
            if (id != mapInstance.MapInstanceId)
            {
                return BadRequest();
            }

            _context.Entry(mapInstance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MapInstanceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/MapInstance
        [HttpPost]
        public async Task<ActionResult<MapInstance>> PostMapInstance(MapInstance mapInstance)
        {
            _context.MapInstance.Add(mapInstance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMapInstance", new { id = mapInstance.MapInstanceId }, mapInstance);
        }

        // DELETE: api/MapInstance/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<MapInstance>> DeleteMapInstance(long id)
        {
            var mapInstance = await _context.MapInstance.FindAsync(id);
            if (mapInstance == null)
            {
                return NotFound();
            }

            _context.MapInstance.Remove(mapInstance);
            await _context.SaveChangesAsync();

            return mapInstance;
        }

        private bool MapInstanceExists(long id)
        {
            return _context.MapInstance.Any(e => e.MapInstanceId == id);
        }
    }
}
