using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace JNCCMapConfigEditor.Pages.LayerItem
{
    public class IndexModel : PageModel
    {
        private readonly MapConfig.Models.MapConfigContext _context;

        public IndexModel(MapConfig.Models.MapConfigContext context)
        {
            _context = context;
        }

        public IList<MapConfig.Models.LayerItem> LayerItem { get;set; }

        public async Task OnGetAsync()
        {
            LayerItem = await _context.LayerItem.ToListAsync();
        }
    }
}
