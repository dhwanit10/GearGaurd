using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearGaurd_Backend.Models;

[Table("Availability")]
public class Availability
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int TeamMemberId { get; set; }

    // Navigation properties
    [ForeignKey("TeamMemberId")]
    public TeamMember TeamMember { get; set; } = null!;
}
