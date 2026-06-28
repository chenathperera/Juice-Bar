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
    public async Task<ActionResult<PagedResultDto<JuiceDto>>> GetJuices(
        [FromQuery] string? search,
        [FromQuery] int? categoryId,
        [FromQuery] bool? isAvailable,
        [FromQuery] string? sortBy,
        [FromQuery] string? sortDirection,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 5)
    {
        var juices = await _juiceService.GetAllAsync(
            search,
            categoryId,
            isAvailable,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize);
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
    public async Task<ActionResult<JuiceDto>> CreateJuice([FromForm] CreateJuiceDto createJuiceDto)
    {
        try
        {
            var createdJuice = await _juiceService.CreateAsync(createJuiceDto);

            return CreatedAtAction(nameof(GetJuice), new { id = createdJuice.Id }, createdJuice);
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJuice(int id, [FromForm] UpdateJuiceDto updateJuiceDto)
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
        catch (InvalidOperationException exception)
        {
            return BadRequest(new { message = exception.Message });
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
