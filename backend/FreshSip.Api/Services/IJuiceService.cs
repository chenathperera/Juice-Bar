using FreshSip.Api.DTOs;

namespace FreshSip.Api.Services;

public interface IJuiceService
{
    Task<IEnumerable<JuiceDto>> GetAllAsync();

    Task<JuiceDto?> GetByIdAsync(int id);

    Task<JuiceDto> CreateAsync(CreateJuiceDto createJuiceDto);

    Task<bool> UpdateAsync(int id, UpdateJuiceDto updateJuiceDto);

    Task<bool> DeleteAsync(int id);
}
