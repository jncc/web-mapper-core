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
    public class BaseLayerController : ControllerBase
    {
        private readonly MapConfigContext _context;

        public BaseLayerController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/BaseLayer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BaseLayer>>> GetBaseLayer()
        {
            return await _context.BaseLayer.ToListAsync();
        }

        // GET: api/BaseLayer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseLayer>> GetBaseLayer(long id)
        {
            var baseLayer = await _context.BaseLayer.FindAsync(id);

            if (baseLayer == null)
            {
                return NotFound();
            }

            return baseLayer;
        }

        // PUT: api/BaseLayer/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBaseLayer(long id, BaseLayer baseLayer)
        {
            if (id != baseLayer.BaseLayerId)
            {
                return BadRequest();
            }

            _context.Entry(baseLayer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BaseLayerExists(id))
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

        // POST: api/BaseLayer
        [HttpPost]
        public async Task<ActionResult<BaseLayer>> PostBaseLayer(BaseLayer baseLayer)
        {
            _context.BaseLayer.Add(baseLayer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBaseLayer", new { id = baseLayer.BaseLayerId }, baseLayer);
        }

        // DELETE: api/BaseLayer/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseLayer>> DeleteBaseLayer(long id)
        {
            var baseLayer = await _context.BaseLayer.FindAsync(id);
            if (baseLayer == null)
            {
                return NotFound();
            }

            _context.BaseLayer.Remove(baseLayer);
            await _context.SaveChangesAsync();

            return baseLayer;
        }

        private bool BaseLayerExists(long id)
        {
            return _context.BaseLayer.Any(e => e.BaseLayerId == id);
        }
    }
}
