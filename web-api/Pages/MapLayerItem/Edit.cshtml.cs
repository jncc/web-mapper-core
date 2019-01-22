using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace JNCCMapConfigEditor.Pages.MapLayerItem
{
    public class EditModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public EditModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        [BindProperty]
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
           ViewData["LayerId"] = new SelectList(_context.LayerItem, "LayerId", "LayerId");
           ViewData["MapId"] = new SelectList(_context.MapItem, "MapId", "MapId");
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Attach(MapLayerItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MapLayerItemExists(MapLayerItem.MapLayerId))
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

        private bool MapLayerItemExists(long id)
        {
            return _context.MapLayerItem.Any(e => e.MapLayerId == id);
        }
    }
}
