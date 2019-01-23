using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Test.Models;

namespace Test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : Controller
    {
        private readonly TestContext _context;

        public TestController(TestContext context)
        {
            _context = context;
            if (_context.TestItem.Count() == 0)
            {
                // Create a new TestItem if collection is empty,
                // which means you can't delete all TodoItems.
                _context.TestItem.Add(new TestItem { Name = "EMODnet", Description = "<p>Configurable <strong>EMODnet</strong> description.</p><p><a href=\"http://www.emodnet.eu/\" target=\"_blank\">EMODnet</a></p>" });
                _context.TestItem.Add(new TestItem { Name = "OSPAR", Description = "<p>Configurable <strong>OSPAR</strong> description.</p><p><a href=\"https://www.ospar.org/\" target=\"_blank\">OSPAR</a></p>" });
                _context.SaveChanges();
            }
        }

        // GET: api/Test
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestItem>>> GetTest()
        {
            var TestData = await _context.TestItem.ToListAsync();            
            return Json( new { mapInstances = TestData } );
        }

        // GET: api/Test/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TestItem>> GetTest(long id)
        {
            var Test = await _context.TestItem.FindAsync(id);

            if (Test == null)
            {
                return NotFound();
            }

            return Test;
        }

        // PUT: api/Test/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTest(long id, TestItem TestItem)
        {
            if (id != TestItem.TestId)
            {
                return BadRequest();
            }

            _context.Entry(TestItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TestExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Test
        [HttpPost]
        public async Task<ActionResult<TestItem>> PostTest(TestItem TestItem)
        {
            _context.TestItem.Add(TestItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTest", new { id = TestItem.TestId }, TestItem);
        }

        // DELETE: api/Test/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TestItem>> DeleteTest(long id)
        {
            var Test = await _context.TestItem.FindAsync(id);
            if (Test == null)
            {
                return NotFound();
            }

            _context.TestItem.Remove(Test);
            await _context.SaveChangesAsync();

            return Test;
        }

        private bool TestExists(long id)
        {
            return _context.TestItem.Any(e => e.TestId == id);
        }
    }
}
