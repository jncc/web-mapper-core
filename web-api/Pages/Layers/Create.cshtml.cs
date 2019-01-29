using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using MapConfig.Models;

namespace jncc_web_api.Pages.Layers
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
        ViewData["LayerGroupId"] = new SelectList(_context.LayerGroup, "LayerGroupId", "LayerGroupId");
            return Page();
        }

        [BindProperty]
        public Layer Layer { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Layer.Add(Layer);
            await _context.SaveChangesAsync();

            return RedirectToPage("./Index");
        }
    }
}