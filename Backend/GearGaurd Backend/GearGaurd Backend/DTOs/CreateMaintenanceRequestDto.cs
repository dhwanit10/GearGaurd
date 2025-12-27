using System.ComponentModel.DataAnnotations;

namespace GearGaurd_Backend.DTOs;

public class CreateMaintenanceRequestDto
{
    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    public int EquipmentId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Type { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    public int CreatedBy { get; set; }

    [Required]
    public int CategoryId { get; set; }
}
