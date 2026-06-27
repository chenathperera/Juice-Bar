using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace FreshSip.Api.DTOs;

public class CreateCategoryDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public IFormFile? ImageFile { get; set; }
}
