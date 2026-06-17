namespace FreshSip.Api.Models;

public class Juice
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public string? ImageUrl { get; set; }

    public int CategoryId { get; set; }

    public Category Category { get; set; } = null!;

    public bool IsAvailable { get; set; }
}
