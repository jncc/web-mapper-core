using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace JNCCMapConfigEditor.Pages.MapLayerItem
{
    public class IndexModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public IndexModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        public IList<MapConfig.Models.MapLayerItem> MapLayerItem { get;set; }

        public async Task OnGetAsync()
        {
            MapLayerItem = await _context.MapLayerItem
                .Include(m => m.LayerItem)
                .Include(m => m.MapItem).ToListAsync();
        }
    }
}
