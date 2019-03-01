using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NPOI.XSSF.UserModel;
using NPOI.SS.UserModel;

using Config.Options;
using MapConfig.Models;

namespace MapConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoadGazetteerController : Controller
    {
        private readonly MapConfigContext _context;
        private readonly IOptions<WebApiConfig> _webapiconfig;
        public LoadGazetteerController(MapConfigContext context, IOptions<WebApiConfig> webapiconfig)
        {
            _context = context;
            _webapiconfig = webapiconfig;
        }

        // GET: api/LoadGazetteer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MapInstance>>> LoadGazetteer()
        {
            //Gazetteer
            var gazetteer = _context.Gazetteer.Where(g => g.Imported==true);
            _context.Gazetteer.RemoveRange(gazetteer);

            XSSFWorkbook hssfwb;
            try {
                using (FileStream stream = new FileStream("TestData/Gazetteer_data.xlsx", FileMode.Open, FileAccess.Read))
                {
                    hssfwb = new XSSFWorkbook(stream);
                }
            } catch (InvalidOperationException ex) {
                return Json ( new { result = "error", type = ex.GetType().FullName, error = ex.Message });
            } 
            ISheet sheet = hssfwb.GetSheet("OSPAR regions");
            for (int row = 1; row <= sheet.LastRowNum; row++) {
                if (sheet.GetRow(row) != null) {
                    var ge= new Gazetteer { 
                        Name = sheet.GetRow(row).GetCell(1).StringCellValue.Trim(),
                        Category = "OSPAR Regions",
                        Xmin = sheet.GetRow(row).GetCell(2).NumericCellValue,
                        Ymin = sheet.GetRow(row).GetCell(4).NumericCellValue,
                        Xmax = sheet.GetRow(row).GetCell(3).NumericCellValue,
                        Ymax = sheet.GetRow(row).GetCell(5).NumericCellValue,
                        Imported=true
                    };
                    _context.Gazetteer.Add(ge);
                    _context.SaveChanges();
                }
            }
            sheet = hssfwb.GetSheet("ICES Ecoregions");
            for (int row = 1; row <= sheet.LastRowNum; row++) {
                if (sheet.GetRow(row) != null) {
                    var ge= new Gazetteer { 
                        Name = sheet.GetRow(row).GetCell(1).StringCellValue.Trim(),
                        Category = "ICES ECO Regions",
                        Xmin = sheet.GetRow(row).GetCell(2).NumericCellValue,
                        Ymin = sheet.GetRow(row).GetCell(4).NumericCellValue,
                        Xmax = sheet.GetRow(row).GetCell(3).NumericCellValue,
                        Ymax = sheet.GetRow(row).GetCell(5).NumericCellValue,
                        Imported=true
                    };
                    _context.Gazetteer.Add(ge);
                    _context.SaveChanges();
                }
            }
            sheet = hssfwb.GetSheet("EEZs");
            for (int row = 1; row <= sheet.LastRowNum; row++) {
                if (sheet.GetRow(row) != null) {
                    var ge= new Gazetteer { 
                        Name = sheet.GetRow(row).GetCell(1).StringCellValue.Trim(),
                        Category = "EEZ",
                        Xmin = sheet.GetRow(row).GetCell(5).NumericCellValue,
                        Ymin = sheet.GetRow(row).GetCell(7).NumericCellValue,
                        Xmax = sheet.GetRow(row).GetCell(6).NumericCellValue,
                        Ymax = sheet.GetRow(row).GetCell(8).NumericCellValue,
                        Imported=true
                    };
                    _context.Gazetteer.Add(ge);
                    _context.SaveChanges();
                }
            }

            return Json ( new { result = "success" });
        }
    }

}