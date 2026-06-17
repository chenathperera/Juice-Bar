using FreshSip.Api.DTOs;

namespace FreshSip.Api.Services;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync();

    Task<CategoryDto?> GetByIdAsync(int id);

    Task<CategoryDto> CreateAsync(CreateCategoryDto createCategoryDto);

    Task<bool> UpdateAsync(int id, UpdateCategoryDto updateCategoryDto);

    Task<bool> DeleteAsync(int id);
}
