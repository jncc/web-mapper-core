using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace jncc_web_api.Pages.Layers
{
    public class DetailsModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public DetailsModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        public Layer Layer { get; set; }

        public async Task<IActionResult> OnGetAsync(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            Layer = await _context.Layers.FirstOrDefaultAsync(m => m.LayerId == id);

            if (Layer == null)
            {
                return NotFound();
            }
            return Page();
        }
    }
}
