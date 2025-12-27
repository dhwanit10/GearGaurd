using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearGaurd_Backend.Models;

[Table("Equipment")]
public class Equipment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string SerialNo { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Department { get; set; } = string.Empty;

    [Required]
    public int CategoryId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    [Required]
    public int MaintenanceTeamId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    [Required]
    public DateTime PurchaseDate { get; set; }

    public DateTime? WarrantyEnd { get; set; }

    [Required]
    public int OwnedBy { get; set; }

    // Navigation properties
    [ForeignKey("CategoryId")]
    public Category Category { get; set; } = null!;

    [ForeignKey("MaintenanceTeamId")]
    public Team MaintenanceTeam { get; set; } = null!;

    [ForeignKey("OwnedBy")]
    public User Owner { get; set; } = null!;

    public ICollection<MaintenanceRequest> MaintenanceRequests { get; set; } = new List<MaintenanceRequest>();
}
