namespace GearGaurd_Backend.DTOs;

public class CategoryResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Related entity details (not just ID)
    public TeamDetailsDto Team { get; set; } = null!;
}
