using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearGaurd_Backend.Models;

[Table("RequestStatusHistory")]
public class RequestStatusHistory
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int RequestId { get; set; }

    [Required]
    [MaxLength(50)]
    public string OldStatus { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string NewStatus { get; set; } = string.Empty;

    [Required]
    public int ChangedBy { get; set; }

    [Required]
    public DateTime ChangedAt { get; set; }

    // Navigation properties
    [ForeignKey("RequestId")]
    public MaintenanceRequest Request { get; set; } = null!;

    [ForeignKey("ChangedBy")]
    public TeamMember ChangedByMember { get; set; } = null!;
}
