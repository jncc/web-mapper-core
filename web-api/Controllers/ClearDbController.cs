using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Config.Options;
using MapConfig.Models;

namespace MapConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClearDbController : Controller
    {
        private readonly MapConfigContext _context;
        private readonly IOptions<WebApiConfig> _webapiconfig;
        public ClearDbController(MapConfigContext context, IOptions<WebApiConfig> webapiconfig)
        {
            _context = context;
            _webapiconfig = webapiconfig;
        }

        // GET: api/ClearDb
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MapInstance>>> ClearDb()
        {
            //Additional BaseLayers
            var baselayer = _context.BaseLayer.Where(e =>e.Name.EndsWith("(Test)"));
            _context.BaseLayer.RemoveRange(baselayer);

            //External WMS Sources
            var externalwms = _context.ExternalWmsUrl.Where(e =>e.Name.EndsWith("(Test)"));
            _context.ExternalWmsUrl.RemoveRange(externalwms);

            //LayerGroups
            var layergroups = _context.LayerGroup.Where(f => f.Name.EndsWith("(Test)"));
            _context.LayerGroup.RemoveRange(layergroups);

            //Layers
            var layers = _context.Layer.Where(f => f.Name.EndsWith("(Test)"));
            _context.Layer.RemoveRange(layers);

            //Filters
            var filters = _context.Filter.Where(f => f.Name.EndsWith("(Test)"));
            _context.Filter.RemoveRange(filters);

            IQueryable<Lookup> habitats;
            habitats = _context.Lookup.Where(l => l.LookupCategory == "EunisHabitats");
            _context.Lookup.RemoveRange(habitats);

            habitats = _context.Lookup.Where(l => l.LookupCategory == "OsparHabitats");
            _context.Lookup.RemoveRange(habitats);


            //Gazetteer
            var gazetteer = _context.Gazetteer.Where(g => g.Name.EndsWith("(Test)"));
            _context.Gazetteer.RemoveRange(gazetteer);

            return Json ( new { result = "success" });
        }

    }

}