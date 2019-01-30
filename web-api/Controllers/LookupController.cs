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
    public class LookupController : ControllerBase
    {
        private readonly MapConfigContext _context;

        public LookupController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/Lookup
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lookup>>> GetLookup()
        {
            return await _context.Lookup.ToListAsync();
        }

        // GET: api/Lookup/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Lookup>> GetLookup(long id)
        {
            var lookup = await _context.Lookup.FindAsync(id);

            if (lookup == null)
            {
                return NotFound();
            }

            return lookup;
        }

        // PUT: api/Lookup/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLookup(long id, Lookup lookup)
        {
            if (id != lookup.LookupId)
            {
                return BadRequest();
            }

            _context.Entry(lookup).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LookupExists(id))
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

        // POST: api/Lookup
        [HttpPost]
        public async Task<ActionResult<Lookup>> PostLookup(Lookup lookup)
        {
            _context.Lookup.Add(lookup);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLookup", new { id = lookup.LookupId }, lookup);
        }

        // DELETE: api/Lookup/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Lookup>> DeleteLookup(long id)
        {
            var lookup = await _context.Lookup.FindAsync(id);
            if (lookup == null)
            {
                return NotFound();
            }

            _context.Lookup.Remove(lookup);
            await _context.SaveChangesAsync();

            return lookup;
        }

        private bool LookupExists(long id)
        {
            return _context.Lookup.Any(e => e.LookupId == id);
        }
    }
}
