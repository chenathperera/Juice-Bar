using FreshSip.Api.Data;
using FreshSip.Api.DTOs;
using FreshSip.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FreshSip.Api.Services;

public class CategoryService : ICategoryService
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public CategoryService(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        return await _context.Categories
            .Select(category => MapToCategoryDto(category))
            .ToListAsync();
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return null;
        }

        return MapToCategoryDto(category);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto createCategoryDto)
    {
        var category = new Category
        {
            Name = createCategoryDto.Name.Trim(),
            Description = createCategoryDto.Description,
            ImageUrl = await SaveCategoryImageAsync(createCategoryDto.ImageFile)
                ?? NormalizeImageUrl(createCategoryDto.ImageUrl)
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return MapToCategoryDto(category);
    }

    public async Task<bool> UpdateAsync(int id, UpdateCategoryDto updateCategoryDto)
    {
        var existingCategory = await _context.Categories.FindAsync(id);

        if (existingCategory == null)
        {
            return false;
        }

        existingCategory.Name = updateCategoryDto.Name.Trim();
        existingCategory.Description = updateCategoryDto.Description;
        var newImagePath = await SaveCategoryImageAsync(updateCategoryDto.ImageFile);

        if (!string.IsNullOrWhiteSpace(newImagePath))
        {
            DeleteLocalImage(existingCategory.ImageUrl);
            existingCategory.ImageUrl = newImagePath;
        }
        else
        {
            existingCategory.ImageUrl = NormalizeImageUrl(updateCategoryDto.ImageUrl);
        }

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return false;
        }

        var hasJuices = await _context.Juices.AnyAsync(juice => juice.CategoryId == id);

        if (hasJuices)
        {
            throw new InvalidOperationException("This category cannot be deleted because it is still used by one or more juices.");
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return true;
    }

    private static CategoryDto MapToCategoryDto(Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ImageUrl = category.ImageUrl
        };
    }

    private async Task<string?> SaveCategoryImageAsync(IFormFile? imageFile)
    {
        if (imageFile == null || imageFile.Length == 0)
        {
            return null;
        }

        var extension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
        var allowedExtensions = new[] { ".png", ".jpg", ".jpeg", ".webp" };

        if (!allowedExtensions.Contains(extension))
        {
            throw new InvalidOperationException("Only PNG, JPG, JPEG, and WEBP image files are allowed.");
        }

        var uploadsFolder = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "categories");
        Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await imageFile.CopyToAsync(stream);

        return $"/uploads/categories/{fileName}";
    }

    private static string? NormalizeImageUrl(string? imageUrl)
    {
        return string.IsNullOrWhiteSpace(imageUrl) ? null : imageUrl.Trim();
    }

    private void DeleteLocalImage(string? imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl) || !imageUrl.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        var relativePath = imageUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
        var filePath = Path.Combine(_environment.WebRootPath ?? "wwwroot", relativePath);

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }
}
