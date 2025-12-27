using System.ComponentModel.DataAnnotations;

namespace GearGaurd_Backend.DTOs;

public class UpdateTeamMemberRequestDto
{
    [Required]
    public int Id { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required]
    public int UserId { get; set; }
}
