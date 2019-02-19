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
    public class GazetteerController : Controller
    {
        private readonly MapConfigContext _context;

        public GazetteerController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/Gazetteer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Gazetteer>>> GetGazetteer()
        {
            return await _context.Gazetteer.ToListAsync();
        }

        // GET: api/Gazetteer/name
        [HttpGet("{name}")]
        public async Task<ActionResult<Gazetteer>> GetGazetteer(string name)
        {
            var gazetteer = await _context.Gazetteer
                .Where(m => m.Name.ToUpper().StartsWith(name.ToUpper()))
                .ToListAsync();   

            if (gazetteer == null)
            {
                return NotFound();
            }

            return Json( gazetteer );
        }
    }
}
