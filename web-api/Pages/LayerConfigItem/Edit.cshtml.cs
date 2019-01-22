using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace JNCCMapConfigEditor.Pages.LayerConfigItem
{
    public class EditModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public EditModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        [BindProperty]
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
           ViewData["LayerId"] = new SelectList(_context.LayerItem, "LayerId", "LayerId");
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Attach(LayerConfigItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LayerConfigItemExists(LayerConfigItem.LayerConfigId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return RedirectToPage("./Index");
        }

        private bool LayerConfigItemExists(long id)
        {
            return _context.LayerConfigItem.Any(e => e.LayerConfigId == id);
        }
    }
}
