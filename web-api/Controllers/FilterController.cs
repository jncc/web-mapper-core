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
    public class FilterController : ControllerBase
    {
        private readonly MapConfigContext _context;

        public FilterController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/Filter
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Filter>>> GetFilters()
        {
            return await _context.Filters.ToListAsync();
        }

        // GET: api/Filter/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Filter>> GetFilter(long id)
        {
            var filter = await _context.Filters.FindAsync(id);

            if (filter == null)
            {
                return NotFound();
            }

            return filter;
        }

        // PUT: api/Filter/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFilter(long id, Filter filter)
        {
            if (id != filter.FilterId)
            {
                return BadRequest();
            }

            _context.Entry(filter).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FilterExists(id))
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

        // POST: api/Filter
        [HttpPost]
        public async Task<ActionResult<Filter>> PostFilter(Filter filter)
        {
            _context.Filters.Add(filter);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFilter", new { id = filter.FilterId }, filter);
        }

        // DELETE: api/Filter/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Filter>> DeleteFilter(long id)
        {
            var filter = await _context.Filters.FindAsync(id);
            if (filter == null)
            {
                return NotFound();
            }

            _context.Filters.Remove(filter);
            await _context.SaveChangesAsync();

            return filter;
        }

        private bool FilterExists(long id)
        {
            return _context.Filters.Any(e => e.FilterId == id);
        }
    }
}
