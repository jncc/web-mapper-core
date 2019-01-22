using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace JNCCMapConfigEditor.Pages.MapConfigItem
{
    public class EditModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public EditModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        [BindProperty]
        public MapConfig.Models.MapConfigItem MapConfigItem { get; set; }

        public async Task<IActionResult> OnGetAsync(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            MapConfigItem = await _context.MapConfigItem
                .Include(m => m.MapItem).FirstOrDefaultAsync(m => m.MapConfigId == id);

            if (MapConfigItem == null)
            {
                return NotFound();
            }
           ViewData["MapId"] = new SelectList(_context.MapItem, "MapId", "MapId");
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Attach(MapConfigItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MapConfigItemExists(MapConfigItem.MapConfigId))
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

        private bool MapConfigItemExists(long id)
        {
            return _context.MapConfigItem.Any(e => e.MapConfigId == id);
        }
    }
}
