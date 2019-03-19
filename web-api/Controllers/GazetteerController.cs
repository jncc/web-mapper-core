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
            List<Gazetteer> gazetteer;
            if(name.Length<3) {
                gazetteer = new List<Gazetteer>();
            } else {
                gazetteer = await _context.Gazetteer
                    .Where(m => m.Name.ToUpper().Contains(name.ToUpper()))
                    .ToListAsync();
            }  

            int gazcount = gazetteer.Count();
            for(var i=0;i<gazcount;i++) {
                gazetteer[i].Extent[0] = gazetteer[i].Xmin;
                gazetteer[i].Extent[1] = gazetteer[i].Ymin;
                gazetteer[i].Extent[2] = gazetteer[i].Xmax;
                gazetteer[i].Extent[3] = gazetteer[i].Ymax;
            }
            return Json( gazetteer );
        }
    }
}
