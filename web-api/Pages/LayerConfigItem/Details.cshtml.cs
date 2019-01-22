using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace JNCCMapConfigEditor.Pages.LayerConfigItem
{
    public class DetailsModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public DetailsModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        public MapConfig.Models.LayerConfigItem LayerConfigItem { get; set; }

        public async Task<IActionResult> OnGetAsync(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            LayerConfigItem = await _context.LayerConfigItem
                .Include(l => l.LayerItem).FirstOrDefaultAsync(m => m.LayerConfigId == id);

            if (LayerConfigItem == null)
            {
                return NotFound();
            }
            return Page();
        }
    }
}
