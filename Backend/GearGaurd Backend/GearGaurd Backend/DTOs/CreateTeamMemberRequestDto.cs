using System.ComponentModel.DataAnnotations;

namespace GearGaurd_Backend.DTOs;

public class CreateTeamMemberRequestDto
{
    [Required]
    public int TeamId { get; set; }

    [Required]
    public int UserId { get; set; }
}
