using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace JNCCMapConfigEditor.Pages.MapConfigItem
{
    public class IndexModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public IndexModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        public IList<MapConfig.Models.MapConfigItem> MapConfigItem { get;set; }

        public async Task OnGetAsync()
        {
            MapConfigItem = await _context.MapConfigItem
                .Include(m => m.MapItem).ToListAsync();
        }
    }
}
