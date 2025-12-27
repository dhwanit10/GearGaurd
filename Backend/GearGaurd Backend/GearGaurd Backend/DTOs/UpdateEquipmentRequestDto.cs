using System.ComponentModel.DataAnnotations;

namespace GearGaurd_Backend.DTOs;

public class UpdateEquipmentRequestDto
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string SerialNo { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Department { get; set; } = string.Empty;

    [Required]
    public int CategoryId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    [Required]
    public int MaintenanceTeamId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    [Required]
    public DateTime PurchaseDate { get; set; }

    public DateTime? WarrantyEnd { get; set; }

    [Required]
    public int OwnedBy { get; set; }
}
