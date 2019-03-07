using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace jncc_web_api.Pages.ExternalWmsUrls
{
    public class DeleteModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public DeleteModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        [BindProperty]
        public ExternalWmsUrl ExternalWmsUrl { get; set; }

        public async Task<IActionResult> OnGetAsync(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            ExternalWmsUrl = await _context.ExternalWmsUrl
                .Include(e => e.Map).FirstOrDefaultAsync(m => m.ExternalWmsUrlId == id);

            if (ExternalWmsUrl == null)
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

            ExternalWmsUrl = await _context.ExternalWmsUrl.FindAsync(id);

            if (ExternalWmsUrl != null)
            {
                _context.ExternalWmsUrl.Remove(ExternalWmsUrl);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("./Index");
        }
    }
}
