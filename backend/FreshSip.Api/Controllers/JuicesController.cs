using FreshSip.Api.DTOs;
using FreshSip.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FreshSip.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JuicesController : ControllerBase
{
    private readonly IJuiceService _juiceService;

    public JuicesController(IJuiceService juiceService)
    {
        _juiceService = juiceService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<JuiceDto>>> GetJuices()
    {
        var juices = await _juiceService.GetAllAsync();
        return Ok(juices);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<JuiceDto>> GetJuice(int id)
    {
        var juice = await _juiceService.GetByIdAsync(id);

        if (juice == null)
        {
            return NotFound();
        }

        return Ok(juice);
    }

    [HttpPost]
    public async Task<ActionResult<JuiceDto>> CreateJuice(CreateJuiceDto createJuiceDto)
    {
        try
        {
            var createdJuice = await _juiceService.CreateAsync(createJuiceDto);

            return CreatedAtAction(nameof(GetJuice), new { id = createdJuice.Id }, createdJuice);
        }
        catch (InvalidOperationException)
        {
            return BadRequest(new { message = "The selected category does not exist." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJuice(int id, UpdateJuiceDto updateJuiceDto)
    {
        try
        {
            var wasUpdated = await _juiceService.UpdateAsync(id, updateJuiceDto);

            if (!wasUpdated)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (InvalidOperationException)
        {
            return BadRequest(new { message = "The selected category does not exist." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJuice(int id)
    {
        var wasDeleted = await _juiceService.DeleteAsync(id);

        if (!wasDeleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
