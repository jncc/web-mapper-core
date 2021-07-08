using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

using Config.Options;
using MapConfig.Models;

namespace MapConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GazetteerController : Controller
    {
        private readonly MapConfigContext _context;
        private readonly IOptions<WebApiConfig> _webapiconfig;

        public GazetteerController(MapConfigContext context, IOptions<WebApiConfig> webapiconfig)
        {
            _context = context;
            _webapiconfig = webapiconfig;
        }

        // GET: api/Gazetteer/name
        [HttpGet("{name?}")]
        public async Task<ActionResult<Gazetteer>> GetGazetteer(string name = null)
        {
            List<Gazetteer> gazetteer = new List<Gazetteer>();
            if(String.IsNullOrWhiteSpace(name))
            {
                return Json( gazetteer );
            }

            int limit = _webapiconfig.Value.MaxGazetteerResults;
            gazetteer = await _context.Gazetteer
                .Where(g => g.Name.ToUpper().Contains(name.ToUpper()))
                .OrderBy(g => g.Name.ToUpper().IndexOf(name.ToUpper()))
                .Take(limit)
                .ToListAsync(); 

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
