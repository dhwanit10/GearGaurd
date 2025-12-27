using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearGaurd_Backend.Models;

[Table("TeamMember")]
public class TeamMember
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required]
    public int UserId { get; set; }

    // Navigation properties
    [ForeignKey("TeamId")]
    public Team Team { get; set; } = null!;

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    public ICollection<Availability> Availabilities { get; set; } = new List<Availability>();
    public ICollection<MaintenanceRequest> AssignedRequests { get; set; } = new List<MaintenanceRequest>();
    public ICollection<RequestStatusHistory> StatusChanges { get; set; } = new List<RequestStatusHistory>();
}
