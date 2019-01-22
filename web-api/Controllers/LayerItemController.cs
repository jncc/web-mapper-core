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
    public class LayerItemController : ControllerBase
    {
        private readonly MapConfigContext _context;

        public LayerItemController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/LayerItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LayerItem>>> GetLayerItem()
        {
            return await _context.LayerItem.ToListAsync();
        }

        // GET: api/LayerItem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LayerItem>> GetLayerItem(long id)
        {
            var layerItem = await _context.LayerItem.FindAsync(id);

            if (layerItem == null)
            {
                return NotFound();
            }

            return layerItem;
        }

        // PUT: api/LayerItem/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLayerItem(long id, LayerItem layerItem)
        {
            if (id != layerItem.LayerId)
            {
                return BadRequest();
            }

            _context.Entry(layerItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LayerItemExists(id))
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

        // POST: api/LayerItem
        [HttpPost]
        public async Task<ActionResult<LayerItem>> PostLayerItem(LayerItem layerItem)
        {
            _context.LayerItem.Add(layerItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLayerItem", new { id = layerItem.LayerId }, layerItem);
        }

        // DELETE: api/LayerItem/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<LayerItem>> DeleteLayerItem(long id)
        {
            var layerItem = await _context.LayerItem.FindAsync(id);
            if (layerItem == null)
            {
                return NotFound();
            }

            _context.LayerItem.Remove(layerItem);
            await _context.SaveChangesAsync();

            return layerItem;
        }

        private bool LayerItemExists(long id)
        {
            return _context.LayerItem.Any(e => e.LayerId == id);
        }
    }
}
