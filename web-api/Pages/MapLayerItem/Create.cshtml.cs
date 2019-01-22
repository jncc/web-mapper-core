using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using MapConfig.Models;

namespace JNCCMapConfigEditor.Pages.MapLayerItem
{
    public class CreateModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public CreateModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        public IActionResult OnGet()
        {
        ViewData["LayerId"] = new SelectList(_context.LayerItem, "LayerId", "LayerId");
        ViewData["MapId"] = new SelectList(_context.MapItem, "MapId", "MapId");
            return Page();
        }

        [BindProperty]
        public MapConfig.Models.MapLayerItem MapLayerItem { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.MapLayerItem.Add(MapLayerItem);
            await _context.SaveChangesAsync();

            return RedirectToPage("./Index");
        }
    }
}