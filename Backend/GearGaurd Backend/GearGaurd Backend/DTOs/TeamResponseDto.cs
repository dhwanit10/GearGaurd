namespace GearGaurd_Backend.DTOs;

public class TeamResponseDto
{
    public int Id { get; set; }
    public string TeamName { get; set; } = string.Empty;
    public string? Description { get; set; }
}
