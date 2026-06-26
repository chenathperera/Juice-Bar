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

    public async Task<PagedResultDto<JuiceDto>> GetAllAsync(
        string? search,
        int? categoryId,
        bool? isAvailable,
        string? sortBy,
        string? sortDirection,
        int pageNumber,
        int pageSize)
    {
        pageNumber = pageNumber < 1 ? 1 : pageNumber;
        pageSize = pageSize < 1 ? 5 : pageSize;

        IQueryable<Juice> query = _context.Juices
            .Include(juice => juice.Category);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var trimmedSearch = search.Trim();
            query = query.Where(juice => juice.Name.Contains(trimmedSearch));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(juice => juice.CategoryId == categoryId.Value);
        }

        if (isAvailable.HasValue)
        {
            query = query.Where(juice => juice.IsAvailable == isAvailable.Value);
        }

        query = ApplySorting(query, sortBy, sortDirection);

        var totalCount = await query.CountAsync();
        var totalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize);

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(juice => MapToJuiceDto(juice))
            .ToListAsync();

        return new PagedResultDto<JuiceDto>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages
        };
    }

    public async Task<JuiceDto?> GetByIdAsync(int id)
    {
        var juice = await _context.Juices
            .Include(juice => juice.Category)
            .FirstOrDefaultAsync(juice => juice.Id == id);

        if (juice == null)
        {
            return null;
        }

        return MapToJuiceDto(juice);
    }

    public async Task<JuiceDto> CreateAsync(CreateJuiceDto createJuiceDto)
    {
        var category = await _context.Categories.FindAsync(createJuiceDto.CategoryId)
            ?? throw new InvalidOperationException("The selected category was not found.");

        var juice = new Juice
        {
            Name = createJuiceDto.Name,
            Description = createJuiceDto.Description,
            Price = createJuiceDto.Price,
            ImageUrl = createJuiceDto.ImageUrl,
            IsMostLiked = createJuiceDto.IsMostLiked,
            LikeRate = createJuiceDto.LikeRate,
            CategoryId = category.Id,
            IsAvailable = createJuiceDto.IsAvailable
        };

        _context.Juices.Add(juice);
        await _context.SaveChangesAsync();

        juice.Category = category;

        return MapToJuiceDto(juice);
    }

    public async Task<bool> UpdateAsync(int id, UpdateJuiceDto updateJuiceDto)
    {
        var existingJuice = await _context.Juices.FindAsync(id);

        if (existingJuice == null)
        {
            return false;
        }

        var category = await _context.Categories.FindAsync(updateJuiceDto.CategoryId)
            ?? throw new InvalidOperationException("The selected category was not found.");

        existingJuice.Name = updateJuiceDto.Name;
        existingJuice.Description = updateJuiceDto.Description;
        existingJuice.Price = updateJuiceDto.Price;
        existingJuice.ImageUrl = updateJuiceDto.ImageUrl;
        existingJuice.IsMostLiked = updateJuiceDto.IsMostLiked;
        existingJuice.LikeRate = updateJuiceDto.LikeRate;
        existingJuice.CategoryId = category.Id;
        existingJuice.Category = category;
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

    private static IQueryable<Juice> ApplySorting(IQueryable<Juice> query, string? sortBy, string? sortDirection)
    {
        var normalizedSortBy = sortBy?.Trim().ToLowerInvariant() ?? "name";
        var normalizedSortDirection = sortDirection?.Trim().ToLowerInvariant() ?? "asc";
        var isDescending = normalizedSortDirection == "desc";

        return normalizedSortBy switch
        {
            "price" => isDescending
                ? query.OrderByDescending(juice => juice.Price).ThenBy(juice => juice.Name)
                : query.OrderBy(juice => juice.Price).ThenBy(juice => juice.Name),
            "category" => isDescending
                ? query.OrderByDescending(juice => juice.Category.Name).ThenBy(juice => juice.Name)
                : query.OrderBy(juice => juice.Category.Name).ThenBy(juice => juice.Name),
            "availability" => isDescending
                ? query.OrderByDescending(juice => juice.IsAvailable).ThenBy(juice => juice.Name)
                : query.OrderBy(juice => juice.IsAvailable).ThenBy(juice => juice.Name),
            _ => isDescending
                ? query.OrderByDescending(juice => juice.Name)
                : query.OrderBy(juice => juice.Name)
        };
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
            IsMostLiked = juice.IsMostLiked,
            LikeRate = juice.LikeRate,
            CategoryId = juice.CategoryId,
            CategoryName = juice.Category.Name,
            IsAvailable = juice.IsAvailable
        };
    }
}
