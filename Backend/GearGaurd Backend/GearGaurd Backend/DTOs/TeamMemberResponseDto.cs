namespace GearGaurd_Backend.DTOs;

public class TeamMemberResponseDto
{
    public int Id { get; set; }
    public TeamDetailsDto Team { get; set; } = null!;
    public UserDetailsDto User { get; set; } = null!;
}

public class UserDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string UserType { get; set; } = string.Empty;
}
