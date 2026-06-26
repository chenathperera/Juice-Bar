namespace FreshSip.Api.DTOs;

public class JuiceDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public string? ImageUrl { get; set; }

    public bool IsMostLiked { get; set; }

    public string? LikeRate { get; set; }

    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = string.Empty;

    public bool IsAvailable { get; set; }
}
