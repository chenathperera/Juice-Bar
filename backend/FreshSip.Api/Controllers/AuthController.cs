using FreshSip.Api.DTOs;
using FreshSip.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FreshSip.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        var result = await _authService.RegisterAsync(registerDto);

        if (!result.Succeeded)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(new { message = "User registered successfully." });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
    {
        var authResponse = await _authService.LoginAsync(loginDto);

        if (authResponse == null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        return Ok(authResponse);
    }
}
