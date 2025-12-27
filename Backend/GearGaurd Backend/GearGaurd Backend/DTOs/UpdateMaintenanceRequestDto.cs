using System.ComponentModel.DataAnnotations;

namespace GearGaurd_Backend.DTOs;

public class UpdateMaintenanceRequestDto
{
    [Required]
    public int Id { get; set; }

    public DateTime? ScheduledDate { get; set; }

    public DateTime? ScheduleEnd { get; set; }

    [MaxLength(50)]
    public string? Duration { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;
}
