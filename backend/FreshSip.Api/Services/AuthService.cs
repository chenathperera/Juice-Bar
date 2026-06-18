using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FreshSip.Api.DTOs;
using FreshSip.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace FreshSip.Api.Services;

public class AuthService : IAuthService
{
    private static readonly HashSet<string> AllowedRoles = ["Admin", "Customer"];

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    public async Task<(bool Succeeded, IEnumerable<string> Errors)> RegisterAsync(RegisterDto registerDto)
    {
        var normalizedRole = NormalizeRole(registerDto.Role);

        if (normalizedRole == null)
        {
            return (false, ["Role must be Admin or Customer."]);
        }

        var user = new ApplicationUser
        {
            UserName = registerDto.UserName.Trim(),
            Email = registerDto.Email.Trim()
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            return (false, result.Errors.Select(error => error.Description));
        }

        var roleResult = await _userManager.AddToRoleAsync(user, normalizedRole);

        if (!roleResult.Succeeded)
        {
            await _userManager.DeleteAsync(user);
            return (false, roleResult.Errors.Select(error => error.Description));
        }

        return (true, []);
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email.Trim());

        if (user == null)
        {
            return null;
        }

        var signInResult = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, lockoutOnFailure: false);

        if (!signInResult.Succeeded)
        {
            return null;
        }

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Customer";
        var expiresAt = DateTime.UtcNow.AddMinutes(GetTokenDurationInMinutes());

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(JwtRegisteredClaimNames.UniqueName, user.UserName ?? string.Empty),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Role, role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return new AuthResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            ExpiresAt = expiresAt,
            UserName = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            Role = role
        };
    }

    private static string? NormalizeRole(string role)
    {
        var trimmedRole = role.Trim();

        return AllowedRoles.FirstOrDefault(allowedRole =>
            allowedRole.Equals(trimmedRole, StringComparison.OrdinalIgnoreCase));
    }

    private int GetTokenDurationInMinutes()
    {
        return int.TryParse(_configuration["Jwt:DurationInMinutes"], out var minutes)
            ? minutes
            : 60;
    }
}
