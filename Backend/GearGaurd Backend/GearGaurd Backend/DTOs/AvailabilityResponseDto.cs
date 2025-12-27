namespace GearGaurd_Backend.DTOs;

public class AvailabilityResponseDto
{
    public int Id { get; set; }
    public TeamMemberDetailsDto TeamMember { get; set; } = null!;
}

public class TeamMemberDetailsDto
{
    public int Id { get; set; }
    public TeamDetailsDto Team { get; set; } = null!;
    public UserDetailsDto User { get; set; } = null!;
}
