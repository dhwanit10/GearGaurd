using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearGaurd_Backend.Models;

[Table("MaintenanceRequest")]
public class MaintenanceRequest
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    public int EquipmentId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Type { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    public int? MaintenancePersonId { get; set; }

    [Required]
    public int CreatedBy { get; set; }

    public DateTime? ScheduledDate { get; set; }

    public DateTime? ScheduleEnd { get; set; }

    [MaxLength(50)]
    public string? Duration { get; set; }

    [Required]
    public int CategoryId { get; set; }

    // Navigation properties
    [ForeignKey("EquipmentId")]
    public Equipment Equipment { get; set; } = null!;

    [ForeignKey("MaintenancePersonId")]
    public TeamMember? MaintenancePerson { get; set; }

    [ForeignKey("CreatedBy")]
    public User Creator { get; set; } = null!;

    [ForeignKey("CategoryId")]
    public Category Category { get; set; } = null!;

    public ICollection<RequestStatusHistory> StatusHistories { get; set; } = new List<RequestStatusHistory>();
}
