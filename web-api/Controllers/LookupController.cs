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
    public class LookupController : Controller
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
            var lookups = await _context.Lookup
                .Select(l => l.LookupCategory)
                .Distinct()
                .ToListAsync();

            return Json( new { LookupCategories = lookups });
        }

        // GET: api/Lookup/Habitat
        [HttpGet("{lookupCategory}")]
        public async Task<ActionResult<Lookup>> GetLookup(string lookupCategory)
        {
            var lookups = await _context.Lookup
                .Where(m => m.LookupCategory == lookupCategory)
                .ToListAsync();

            if (lookups == null)
            {
                return NotFound();
            }

            return Json( new { LookupResults = lookups });
        }

    }
}
