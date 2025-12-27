namespace GearGaurd_Backend.DTOs;

public class EquipmentResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SerialNo { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; }
    public DateTime? WarrantyEnd { get; set; }

    // Related entity details (not IDs)
    public CategoryDetailsDto Category { get; set; } = null!;
    public TeamDetailsDto MaintenanceTeam { get; set; } = null!;
    public OwnerDetailsDto Owner { get; set; } = null!;
}

public class CategoryDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class TeamDetailsDto
{
    public int Id { get; set; }
    public string TeamName { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class OwnerDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string UserType { get; set; } = string.Empty;
}
