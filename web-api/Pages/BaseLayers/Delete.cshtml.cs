using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace jncc_web_api.Pages.BaseLayers
{
    public class DeleteModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public DeleteModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        [BindProperty]
        public BaseLayer BaseLayer { get; set; }

        public async Task<IActionResult> OnGetAsync(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            BaseLayer = await _context.BaseLayer.FirstOrDefaultAsync(m => m.BaseLayerId == id);

            if (BaseLayer == null)
            {
                return NotFound();
            }
            return Page();
        }

        public async Task<IActionResult> OnPostAsync(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            BaseLayer = await _context.BaseLayer.FindAsync(id);

            if (BaseLayer != null)
            {
                _context.BaseLayer.Remove(BaseLayer);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("./Index");
        }
    }
}
