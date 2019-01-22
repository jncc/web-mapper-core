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
    public class MapItemController : ControllerBase
    {
        private readonly MapConfigContext _context;

        public MapItemController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/MapItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MapItem>>> GetMapItem()
        {
            return await _context.MapItem.ToListAsync();
        }

        // GET: api/MapItem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MapItem>> GetMapItem(long id)
        {
            var mapItem = await _context.MapItem.FindAsync(id);

            if (mapItem == null)
            {
                return NotFound();
            }

            return mapItem;
        }

        // PUT: api/MapItem/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMapItem(long id, MapItem mapItem)
        {
            if (id != mapItem.MapId)
            {
                return BadRequest();
            }

            _context.Entry(mapItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MapItemExists(id))
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

        // POST: api/MapItem
        [HttpPost]
        public async Task<ActionResult<MapItem>> PostMapItem(MapItem mapItem)
        {
            _context.MapItem.Add(mapItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMapItem", new { id = mapItem.MapId }, mapItem);
        }

        // DELETE: api/MapItem/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<MapItem>> DeleteMapItem(long id)
        {
            var mapItem = await _context.MapItem.FindAsync(id);
            if (mapItem == null)
            {
                return NotFound();
            }

            _context.MapItem.Remove(mapItem);
            await _context.SaveChangesAsync();

            return mapItem;
        }

        private bool MapItemExists(long id)
        {
            return _context.MapItem.Any(e => e.MapId == id);
        }
    }
}
