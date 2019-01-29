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
    public class LayerGroupController : ControllerBase
    {
        private readonly MapConfigContext _context;

        public LayerGroupController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/LayerGroup
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LayerGroup>>> GetLayerGroups()
        {
            return await _context.LayerGroups.ToListAsync();
        }

        // GET: api/LayerGroup/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LayerGroup>> GetLayerGroup(long id)
        {
            var layerGroup = await _context.LayerGroups.FindAsync(id);

            if (layerGroup == null)
            {
                return NotFound();
            }

            return layerGroup;
        }

        // PUT: api/LayerGroup/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLayerGroup(long id, LayerGroup layerGroup)
        {
            if (id != layerGroup.LayerGroupId)
            {
                return BadRequest();
            }

            _context.Entry(layerGroup).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LayerGroupExists(id))
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

        // POST: api/LayerGroup
        [HttpPost]
        public async Task<ActionResult<LayerGroup>> PostLayerGroup(LayerGroup layerGroup)
        {
            _context.LayerGroups.Add(layerGroup);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLayerGroup", new { id = layerGroup.LayerGroupId }, layerGroup);
        }

        // DELETE: api/LayerGroup/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<LayerGroup>> DeleteLayerGroup(long id)
        {
            var layerGroup = await _context.LayerGroups.FindAsync(id);
            if (layerGroup == null)
            {
                return NotFound();
            }

            _context.LayerGroups.Remove(layerGroup);
            await _context.SaveChangesAsync();

            return layerGroup;
        }

        private bool LayerGroupExists(long id)
        {
            return _context.LayerGroups.Any(e => e.LayerGroupId == id);
        }
    }
}
