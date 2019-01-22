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
    public class DetailsModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public DetailsModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        public MapConfig.Models.MapLayerItem MapLayerItem { get; set; }

        public async Task<IActionResult> OnGetAsync(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            MapLayerItem = await _context.MapLayerItem
                .Include(m => m.LayerItem)
                .Include(m => m.MapItem).FirstOrDefaultAsync(m => m.MapLayerId == id);

            if (MapLayerItem == null)
            {
                return NotFound();
            }
            return Page();
        }
    }
}
