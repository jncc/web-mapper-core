using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace MapConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MapInstanceController : Controller
    {
        private readonly MapConfigContext _context;

        public MapInstanceController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/MapInstance
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MapInstance>>> GetMapInstances()
        {
            var maps = await _context.MapInstance
                .Select(l => new { l.MapInstanceId, l.Name, l.Description })
                .ToListAsync();

            return Json( maps );
        }

        // GET: api/MapInstance/Test
        [HttpGet("{name}")]
        public async Task<ActionResult<MapInstance>> GetMapInstances(string name)
        {
            var map = await _context.MapInstance
                .Include(e => e.ExternalWmsUrls)
                .Include(m => m.LayerGroups)
                .ThenInclude(l => l.Layers)
                .ThenInclude(f => f.Filters)
                .SingleOrDefaultAsync(m => m.Name.ToUpper() == name.ToUpper());        

            if (map == null) return NotFound();

            //convert the database MapCentreLon and MapCentreLat to a JSON 'center' array in MapInstance
            map.Center[0] = map.MapCentreLon;
            map.Center[1] = map.MapCentreLat;

            //zoom needs no conversion
            map.Zoom = map.MapZoom;

            //now add the baselayers which are defined as a CSV list
            List<BaseLayer> baseLayers = new List<BaseLayer>();
             
            if(map.BaseLayerList != null) {
                //split the list of BaseLayer Names or Ids into an array and remove leading and trailing spaces          
                var baseLayersList = map.BaseLayerList
                    .Split(",")
                    .Select(e => e.Trim())
                    .Distinct();

                //look up each baseLayerName, first trying by Id then by Name
                if(baseLayersList.Count() > 0) {
                    foreach(string baseLayerName in baseLayersList) {
                        BaseLayer baseLayer = new BaseLayer { BaseLayerId = 0 };
                        try { //try Ids
                            uint baseLayerId = Convert.ToUInt32(baseLayerName, 10);
                            baseLayer = await _context.BaseLayer
                                .SingleOrDefaultAsync(b => b.BaseLayerId == baseLayerId);
                        } catch { //or Names
                            baseLayer = await _context.BaseLayer
                                .SingleOrDefaultAsync(b => b.Name.ToUpper() == baseLayerName.ToUpper());
                        }
                        try {
                            if(baseLayer.BaseLayerId > 0) { //we found the baselayer
                                //check if the baselayer should be visible
                                baseLayer.Visible=false;
                                try { //is it marked visible by Id?
                                    uint visibleLayerId = Convert.ToUInt32(map.VisibleBaseLayer, 10);
                                    if(visibleLayerId == baseLayer.BaseLayerId) baseLayer.Visible=true;                  
                                } catch { //or by Name?
                                    if(map.VisibleBaseLayer == baseLayer.Name) baseLayer.Visible=true;
                                }
                                baseLayers.Add(baseLayer);
                            }
                        } catch {}
                    }
                    map.BaseLayers = baseLayers;
                }
            }

            //convert any LayerCentreLon/Lat values into a JSON 'center' array attribute for the layer, and re-map other fields
            List<LayerGroup> layerGroups = new List<LayerGroup>();
            foreach (LayerGroup layerGroup in map.LayerGroups) {
                List<Layer> layers = new List<Layer>();
                foreach(Layer layer in layerGroup.Layers) {
                    //becomes an array
                    layer.Center[0] = layer.LayerCentreLon;
                    layer.Center[1] = layer.LayerCentreLat;
                    //these need no conversion, just mapping from DB schema name to JSON delivery name
                    layer.Order = layer.LayerOrder;
                    layer.Visible = layer.LayerVisible;
                    layer.Opacity = layer.LayerOpacity;
                    layer.Zoom = layer.LayerZoom;
                    layer.DefaultOrder = layer.LayerDefaultOrder;
                    layer.DownloadLayer = layer.LayerDownloadLayer;

                    List<Filter> filters = new List<Filter>();
                    if( layer.Filters != null ) {
                        foreach(Filter filter in layer.Filters) {
                            filter.Type=filter.Type.ToLower();
                            filters.Add(filter);
                        }
                    }
                    layer.Filters = filters;
                    layers.Add(layer);                    
                }
                layerGroup.Layers = layers;
                layerGroups.Add(layerGroup);
            }

            map.LayerGroups = layerGroups;

            return Json( map );
        }
    }
}