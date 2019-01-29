using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace jncc_web_api.Pages.Layers
{
    public class IndexModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public IndexModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        public IList<Layer> Layer { get;set; }

        public async Task OnGetAsync()
        {
            Layer = await _context.Layers.ToListAsync();
        }
    }
}
