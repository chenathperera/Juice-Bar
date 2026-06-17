using FreshSip.Api.Data;
using FreshSip.Api.DTOs;
using FreshSip.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FreshSip.Api.Services;

public class JuiceService : IJuiceService
{
    private readonly ApplicationDbContext _context;

    public JuiceService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<JuiceDto>> GetAllAsync()
    {
        return await _context.Juices
            .Select(juice => MapToJuiceDto(juice))
            .ToListAsync();
    }

    public async Task<JuiceDto?> GetByIdAsync(int id)
    {
        var juice = await _context.Juices.FindAsync(id);

        if (juice == null)
        {
            return null;
        }

        return MapToJuiceDto(juice);
    }

    public async Task<JuiceDto> CreateAsync(CreateJuiceDto createJuiceDto)
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

        return MapToJuiceDto(juice);
    }

    public async Task<bool> UpdateAsync(int id, UpdateJuiceDto updateJuiceDto)
    {
        var existingJuice = await _context.Juices.FindAsync(id);

        if (existingJuice == null)
        {
            return false;
        }

        existingJuice.Name = updateJuiceDto.Name;
        existingJuice.Description = updateJuiceDto.Description;
        existingJuice.Price = updateJuiceDto.Price;
        existingJuice.ImageUrl = updateJuiceDto.ImageUrl;
        existingJuice.Category = updateJuiceDto.Category;
        existingJuice.IsAvailable = updateJuiceDto.IsAvailable;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var juice = await _context.Juices.FindAsync(id);

        if (juice == null)
        {
            return false;
        }

        _context.Juices.Remove(juice);
        await _context.SaveChangesAsync();

        return true;
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
