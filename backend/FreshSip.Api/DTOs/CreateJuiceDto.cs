using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace FreshSip.Api.DTOs;

public class CreateJuiceDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Range(0.01, 9999.99)]
    public decimal Price { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public IFormFile? ImageFile { get; set; }

    public bool IsMostLiked { get; set; }

    [MaxLength(50)]
    public string? LikeRate { get; set; }

    [Range(1, int.MaxValue)]
    public int CategoryId { get; set; }

    public bool IsAvailable { get; set; }
}
