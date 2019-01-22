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
    public class LayerConfigItemController : ControllerBase
    {
        private readonly MapConfigContext _context;

        public LayerConfigItemController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/LayerConfigItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LayerConfigItem>>> GetLayerConfigItem()
        {
            return await _context.LayerConfigItem.ToListAsync();
        }

        // GET: api/LayerConfigItem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LayerConfigItem>> GetLayerConfigItem(long id)
        {
            var layerConfigItem = await _context.LayerConfigItem.FindAsync(id);

            if (layerConfigItem == null)
            {
                return NotFound();
            }

            return layerConfigItem;
        }

        // PUT: api/LayerConfigItem/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLayerConfigItem(long id, LayerConfigItem layerConfigItem)
        {
            if (id != layerConfigItem.LayerConfigId)
            {
                return BadRequest();
            }

            _context.Entry(layerConfigItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LayerConfigItemExists(id))
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

        // POST: api/LayerConfigItem
        [HttpPost]
        public async Task<ActionResult<LayerConfigItem>> PostLayerConfigItem(LayerConfigItem layerConfigItem)
        {
            _context.LayerConfigItem.Add(layerConfigItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLayerConfigItem", new { id = layerConfigItem.LayerConfigId }, layerConfigItem);
        }

        // DELETE: api/LayerConfigItem/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<LayerConfigItem>> DeleteLayerConfigItem(long id)
        {
            var layerConfigItem = await _context.LayerConfigItem.FindAsync(id);
            if (layerConfigItem == null)
            {
                return NotFound();
            }

            _context.LayerConfigItem.Remove(layerConfigItem);
            await _context.SaveChangesAsync();

            return layerConfigItem;
        }

        private bool LayerConfigItemExists(long id)
        {
            return _context.LayerConfigItem.Any(e => e.LayerConfigId == id);
        }
    }
}
