namespace FreshSip.Api.DTOs;

public class OrderItemDto
{
    public int Id { get; set; }

    public int JuiceId { get; set; }

    public string JuiceName { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal Subtotal { get; set; }
}
