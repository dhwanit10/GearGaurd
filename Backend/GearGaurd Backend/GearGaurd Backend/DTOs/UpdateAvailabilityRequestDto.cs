using System.ComponentModel.DataAnnotations;

namespace GearGaurd_Backend.DTOs;

public class UpdateAvailabilityRequestDto
{
    [Required]
    public int Id { get; set; }

    [Required]
    public int TeamMemberId { get; set; }
}
