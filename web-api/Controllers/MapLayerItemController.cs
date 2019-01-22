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
    public class MapLayerItemController : ControllerBase
    {
        private readonly MapConfigContext _context;

        public MapLayerItemController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/MapLayerItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MapLayerItem>>> GetMapLayerItem()
        {
            return await _context.MapLayerItem.ToListAsync();
        }

        // GET: api/MapLayerItem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MapLayerItem>> GetMapLayerItem(long id)
        {
            var mapLayerItem = await _context.MapLayerItem.FindAsync(id);

            if (mapLayerItem == null)
            {
                return NotFound();
            }

            return mapLayerItem;
        }

        // PUT: api/MapLayerItem/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMapLayerItem(long id, MapLayerItem mapLayerItem)
        {
            if (id != mapLayerItem.MapLayerId)
            {
                return BadRequest();
            }

            _context.Entry(mapLayerItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MapLayerItemExists(id))
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

        // POST: api/MapLayerItem
        [HttpPost]
        public async Task<ActionResult<MapLayerItem>> PostMapLayerItem(MapLayerItem mapLayerItem)
        {
            _context.MapLayerItem.Add(mapLayerItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMapLayerItem", new { id = mapLayerItem.MapLayerId }, mapLayerItem);
        }

        // DELETE: api/MapLayerItem/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<MapLayerItem>> DeleteMapLayerItem(long id)
        {
            var mapLayerItem = await _context.MapLayerItem.FindAsync(id);
            if (mapLayerItem == null)
            {
                return NotFound();
            }

            _context.MapLayerItem.Remove(mapLayerItem);
            await _context.SaveChangesAsync();

            return mapLayerItem;
        }

        private bool MapLayerItemExists(long id)
        {
            return _context.MapLayerItem.Any(e => e.MapLayerId == id);
        }
    }
}
