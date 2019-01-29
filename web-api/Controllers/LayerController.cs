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
    public class LayerController : ControllerBase
    {
        private readonly MapConfigContext _context;

        public LayerController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/Layer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Layer>>> GetLayers()
        {
            return await _context.Layers.ToListAsync();
        }

        // GET: api/Layer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Layer>> GetLayer(long id)
        {
            var layer = await _context.Layers.FindAsync(id);

            if (layer == null)
            {
                return NotFound();
            }

            return layer;
        }

        // PUT: api/Layer/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLayer(long id, Layer layer)
        {
            if (id != layer.LayerId)
            {
                return BadRequest();
            }

            _context.Entry(layer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LayerExists(id))
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

        // POST: api/Layer
        [HttpPost]
        public async Task<ActionResult<Layer>> PostLayer(Layer layer)
        {
            _context.Layers.Add(layer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLayer", new { id = layer.LayerId }, layer);
        }

        // DELETE: api/Layer/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Layer>> DeleteLayer(long id)
        {
            var layer = await _context.Layers.FindAsync(id);
            if (layer == null)
            {
                return NotFound();
            }

            _context.Layers.Remove(layer);
            await _context.SaveChangesAsync();

            return layer;
        }

        private bool LayerExists(long id)
        {
            return _context.Layers.Any(e => e.LayerId == id);
        }
    }
}
