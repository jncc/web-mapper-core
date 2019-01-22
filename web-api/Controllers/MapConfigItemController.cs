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
    public class MapConfigItemController : ControllerBase
    {
        private readonly MapConfigContext _context;

        public MapConfigItemController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/MapConfigItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MapConfigItem>>> GetMapConfigItem()
        {
            return await _context.MapConfigItem.ToListAsync();
        }

        // GET: api/MapConfigItem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MapConfigItem>> GetMapConfigItem(long id)
        {
            var mapConfigItem = await _context.MapConfigItem.FindAsync(id);

            if (mapConfigItem == null)
            {
                return NotFound();
            }

            return mapConfigItem;
        }

        // PUT: api/MapConfigItem/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMapConfigItem(long id, MapConfigItem mapConfigItem)
        {
            if (id != mapConfigItem.MapConfigId)
            {
                return BadRequest();
            }

            _context.Entry(mapConfigItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MapConfigItemExists(id))
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

        // POST: api/MapConfigItem
        [HttpPost]
        public async Task<ActionResult<MapConfigItem>> PostMapConfigItem(MapConfigItem mapConfigItem)
        {
            _context.MapConfigItem.Add(mapConfigItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMapConfigItem", new { id = mapConfigItem.MapConfigId }, mapConfigItem);
        }

        // DELETE: api/MapConfigItem/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<MapConfigItem>> DeleteMapConfigItem(long id)
        {
            var mapConfigItem = await _context.MapConfigItem.FindAsync(id);
            if (mapConfigItem == null)
            {
                return NotFound();
            }

            _context.MapConfigItem.Remove(mapConfigItem);
            await _context.SaveChangesAsync();

            return mapConfigItem;
        }

        private bool MapConfigItemExists(long id)
        {
            return _context.MapConfigItem.Any(e => e.MapConfigId == id);
        }
    }
}
