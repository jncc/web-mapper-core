using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using MapConfig.Models;

namespace JNCCMapConfigEditor.Pages.MapConfigItem
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
        ViewData["MapId"] = new SelectList(_context.MapItem, "MapId", "MapId");
            return Page();
        }

        [BindProperty]
        public MapConfig.Models.MapConfigItem MapConfigItem { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.MapConfigItem.Add(MapConfigItem);
            await _context.SaveChangesAsync();

            return RedirectToPage("./Index");
        }
    }
}