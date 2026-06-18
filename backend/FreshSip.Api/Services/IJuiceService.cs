using FreshSip.Api.DTOs;

namespace FreshSip.Api.Services;

public interface IJuiceService
{
    Task<PagedResultDto<JuiceDto>> GetAllAsync(
        string? search,
        int? categoryId,
        bool? isAvailable,
        int pageNumber,
        int pageSize);

    Task<JuiceDto?> GetByIdAsync(int id);

    Task<JuiceDto> CreateAsync(CreateJuiceDto createJuiceDto);

    Task<bool> UpdateAsync(int id, UpdateJuiceDto updateJuiceDto);

    Task<bool> DeleteAsync(int id);
}
