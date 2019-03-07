using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace jncc_web_api.Pages.ExternalWmsUrls
{
    public class EditModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public EditModel(MapConfig.Models.MapConfigContext context)
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
           ViewData["MapInstanceId"] = new SelectList(_context.MapInstance, "MapInstanceId", "MapInstanceId");
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Attach(ExternalWmsUrl).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExternalWmsUrlExists(ExternalWmsUrl.ExternalWmsUrlId))
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

        private bool ExternalWmsUrlExists(long id)
        {
            return _context.ExternalWmsUrl.Any(e => e.ExternalWmsUrlId == id);
        }
    }
}
