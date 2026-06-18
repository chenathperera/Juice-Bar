using FreshSip.Api.DTOs;

namespace FreshSip.Api.Services;

public interface IAuthService
{
    Task<(bool Succeeded, IEnumerable<string> Errors)> RegisterAsync(RegisterDto registerDto);

    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
}
