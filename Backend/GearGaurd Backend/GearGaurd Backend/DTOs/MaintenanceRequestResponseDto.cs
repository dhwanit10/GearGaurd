namespace GearGaurd_Backend.DTOs;

public class MaintenanceRequestResponseDto
{
    public int Id { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? ScheduledDate { get; set; }
    public DateTime? ScheduleEnd { get; set; }
    public string? Duration { get; set; }

    // Related entity details
    public EquipmentDetailsDto Equipment { get; set; } = null!;
    public TeamMemberDetailsDto? MaintenancePerson { get; set; }
    public UserDetailsDto Creator { get; set; } = null!;
    public CategoryDetailsDto Category { get; set; } = null!;
}

public class EquipmentDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SerialNo { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
