using System.ComponentModel.DataAnnotations;

namespace FreshSip.Api.DTOs;

public class UpdateOrderStatusDto
{
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;
}
