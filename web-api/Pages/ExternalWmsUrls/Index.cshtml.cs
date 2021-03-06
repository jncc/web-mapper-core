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
    public class IndexModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public IndexModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        public IList<ExternalWmsUrl> ExternalWmsUrl { get;set; }

        public async Task OnGetAsync()
        {
            ExternalWmsUrl = await _context.ExternalWmsUrl
                .Include(e => e.Map).ToListAsync();
        }
    }
}
