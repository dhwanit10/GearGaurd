using System.ComponentModel.DataAnnotations;

namespace GearGaurd_Backend.DTOs;

public class CreateTeamRequestDto
{
    [Required]
    [MaxLength(100)]
    public string TeamName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }
}
