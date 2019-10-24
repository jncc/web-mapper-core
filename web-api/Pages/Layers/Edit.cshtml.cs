using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace jncc_web_api.Pages.Layers
{
    public class EditModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public EditModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        [BindProperty]
        public Layer Layer { get; set; }

        public async Task<IActionResult> OnGetAsync(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            Layer = await _context.Layer
                .Include(l => l.LayerGroup).FirstOrDefaultAsync(m => m.LayerId == id);

            if (Layer == null)
            {
                return NotFound();
            }
           ViewData["LayerGroupId"] = new SelectList(_context.LayerGroup, "LayerGroupId", "LayerGroupId");
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Attach(Layer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LayerExists(Layer.LayerId))
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

        private bool LayerExists(long id)
        {
            return _context.Layer.Any(e => e.LayerId == id);
        }
    }
}
