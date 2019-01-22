using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace JNCCMapConfigEditor.Pages.MapItem
{
    public class DetailsModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public DetailsModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        public MapConfig.Models.MapItem MapItem { get; set; }

        public async Task<IActionResult> OnGetAsync(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            MapItem = await _context.MapItem.FirstOrDefaultAsync(m => m.MapId == id);

            if (MapItem == null)
            {
                return NotFound();
            }
            return Page();
        }
    }
}
