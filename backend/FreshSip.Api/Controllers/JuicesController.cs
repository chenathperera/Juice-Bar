using FreshSip.Api.Data;
using FreshSip.Api.DTOs;
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
    public async Task<ActionResult<IEnumerable<JuiceDto>>> GetJuices()
    {
        var juices = await _context.Juices
            .Select(juice => MapToJuiceDto(juice))
            .ToListAsync();

        return Ok(juices);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<JuiceDto>> GetJuice(int id)
    {
        var juice = await _context.Juices.FindAsync(id);

        if (juice == null)
        {
            return NotFound();
        }

        return Ok(MapToJuiceDto(juice));
    }

    [HttpPost]
    public async Task<ActionResult<JuiceDto>> CreateJuice(CreateJuiceDto createJuiceDto)
    {
        var juice = new Juice
        {
            Name = createJuiceDto.Name,
            Description = createJuiceDto.Description,
            Price = createJuiceDto.Price,
            ImageUrl = createJuiceDto.ImageUrl,
            Category = createJuiceDto.Category,
            IsAvailable = createJuiceDto.IsAvailable
        };

        _context.Juices.Add(juice);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetJuice), new { id = juice.Id }, MapToJuiceDto(juice));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJuice(int id, UpdateJuiceDto updateJuiceDto)
    {        
        var existingJuice = await _context.Juices.FindAsync(id);

        if (existingJuice == null)
        {
            return NotFound();
        }

        existingJuice.Name = updateJuiceDto.Name;
        existingJuice.Description = updateJuiceDto.Description;
        existingJuice.Price = updateJuiceDto.Price;
        existingJuice.ImageUrl = updateJuiceDto.ImageUrl;
        existingJuice.Category = updateJuiceDto.Category;
        existingJuice.IsAvailable = updateJuiceDto.IsAvailable;

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

    private static JuiceDto MapToJuiceDto(Juice juice)
    {
        return new JuiceDto
        {
            Id = juice.Id,
            Name = juice.Name,
            Description = juice.Description,
            Price = juice.Price,
            ImageUrl = juice.ImageUrl,
            Category = juice.Category,
            IsAvailable = juice.IsAvailable
        };
    }
}
