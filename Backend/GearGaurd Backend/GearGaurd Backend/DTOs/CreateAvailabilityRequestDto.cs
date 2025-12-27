using System.ComponentModel.DataAnnotations;

namespace GearGaurd_Backend.DTOs;

public class CreateAvailabilityRequestDto
{
    [Required]
    public int TeamMemberId { get; set; }
}
