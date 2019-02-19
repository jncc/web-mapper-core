using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace jncc_web_api.Pages.Gazetteers
{
    public class DeleteModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public DeleteModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        [BindProperty]
        public Gazetteer Gazetteer { get; set; }

        public async Task<IActionResult> OnGetAsync(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            Gazetteer = await _context.Gazetteer.FirstOrDefaultAsync(m => m.GazetteerId == id);

            if (Gazetteer == null)
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

            Gazetteer = await _context.Gazetteer.FindAsync(id);

            if (Gazetteer != null)
            {
                _context.Gazetteer.Remove(Gazetteer);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("./Index");
        }
    }
}
