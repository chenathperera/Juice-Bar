using System.ComponentModel.DataAnnotations;

namespace FreshSip.Api.Models;

public class Category
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public ICollection<Juice> Juices { get; set; } = new List<Juice>();
}
