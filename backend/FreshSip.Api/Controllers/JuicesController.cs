using FreshSip.Api.Data;
using FreshSip.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FreshSip.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JuicesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public JuicesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Juice>>> GetJuices()
    {
        var juices = await _context.Juices.ToListAsync();
        return Ok(juices);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Juice>> GetJuice(int id)
    {
        var juice = await _context.Juices.FindAsync(id);

        if (juice == null)
        {
            return NotFound();
        }

        return Ok(juice);
    }

    [HttpPost]
    public async Task<ActionResult<Juice>> CreateJuice(Juice juice)
    {
        _context.Juices.Add(juice);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetJuice), new { id = juice.Id }, juice);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJuice(int id, Juice juice)
    {
        if (id != juice.Id)
        {
            return BadRequest();
        }

        var existingJuice = await _context.Juices.FindAsync(id);

        if (existingJuice == null)
        {
            return NotFound();
        }

        existingJuice.Name = juice.Name;
        existingJuice.Description = juice.Description;
        existingJuice.Price = juice.Price;
        existingJuice.ImageUrl = juice.ImageUrl;
        existingJuice.Category = juice.Category;
        existingJuice.IsAvailable = juice.IsAvailable;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJuice(int id)
    {
        var juice = await _context.Juices.FindAsync(id);

        if (juice == null)
        {
            return NotFound();
        }

        _context.Juices.Remove(juice);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
