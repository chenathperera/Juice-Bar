using System.ComponentModel.DataAnnotations;

namespace FreshSip.Api.DTOs;

public class CreateOrderDto
{
    [Required]
    [MaxLength(100)]
    public string CustomerName { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string CustomerPhone { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    [Required]
    [MinLength(1)]
    public List<CreateOrderItemDto> Items { get; set; } = [];
}
