using System.ComponentModel.DataAnnotations;

namespace GearGaurd_Backend.DTOs;

public class UpdateCategoryRequestDto
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public int TeamId { get; set; }
}
