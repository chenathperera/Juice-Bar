using System.ComponentModel.DataAnnotations;

namespace FreshSip.Api.DTOs;

public class CreateOrderItemDto
{
    [Range(1, int.MaxValue)]
    public int JuiceId { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}
