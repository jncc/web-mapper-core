using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace jncc_web_api.Pages.MapInstances
{
    public class DeleteModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public DeleteModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        [BindProperty]
        public MapInstance MapInstance { get; set; }

        public async Task<IActionResult> OnGetAsync(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            MapInstance = await _context.MapInstance.FirstOrDefaultAsync(m => m.MapInstanceId == id);

            if (MapInstance == null)
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

            MapInstance = await _context.MapInstance.FindAsync(id);

            if (MapInstance != null)
            {
                _context.MapInstance.Remove(MapInstance);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("./Index");
        }
    }
}
