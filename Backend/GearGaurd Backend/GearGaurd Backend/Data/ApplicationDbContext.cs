using Microsoft.EntityFrameworkCore;
using GearGaurd_Backend.Models;

namespace GearGaurd_Backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<User> Users { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<TeamMember> TeamMembers { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Equipment> Equipment { get; set; }
    public DbSet<MaintenanceRequest> MaintenanceRequests { get; set; }
    public DbSet<Availability> Availabilities { get; set; }
    public DbSet<RequestStatusHistory> RequestStatusHistories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships and constraints
        
        // User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // TeamMember entity
        modelBuilder.Entity<TeamMember>(entity =>
        {
            entity.HasOne(tm => tm.Team)
                .WithMany(t => t.TeamMembers)
                .HasForeignKey(tm => tm.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(tm => tm.User)
                .WithMany(u => u.TeamMembers)
                .HasForeignKey(tm => tm.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.TeamId, e.UserId }).IsUnique();
        });

        // Category entity
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasOne(c => c.Team)
                .WithMany(t => t.Categories)
                .HasForeignKey(c => c.TeamId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Equipment entity
        modelBuilder.Entity<Equipment>(entity =>
        {
            entity.HasOne(e => e.Category)
                .WithMany(c => c.Equipment)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.MaintenanceTeam)
                .WithMany(t => t.MaintenanceEquipment)
                .HasForeignKey(e => e.MaintenanceTeamId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Owner)
                .WithMany(u => u.OwnedEquipment)
                .HasForeignKey(e => e.OwnedBy)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.SerialNo).IsUnique();
        });

        // MaintenanceRequest entity
        modelBuilder.Entity<MaintenanceRequest>(entity =>
        {
            entity.HasOne(mr => mr.Equipment)
                .WithMany(e => e.MaintenanceRequests)
                .HasForeignKey(mr => mr.EquipmentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(mr => mr.MaintenancePerson)
                .WithMany(tm => tm.AssignedRequests)
                .HasForeignKey(mr => mr.MaintenancePersonId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(mr => mr.Creator)
                .WithMany(u => u.CreatedRequests)
                .HasForeignKey(mr => mr.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(mr => mr.Category)
                .WithMany(c => c.MaintenanceRequests)
                .HasForeignKey(mr => mr.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Availability entity
        modelBuilder.Entity<Availability>(entity =>
        {
            entity.HasOne(a => a.TeamMember)
                .WithMany(tm => tm.Availabilities)
                .HasForeignKey(a => a.TeamMemberId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // RequestStatusHistory entity
        modelBuilder.Entity<RequestStatusHistory>(entity =>
        {
            entity.HasOne(rsh => rsh.Request)
                .WithMany(mr => mr.StatusHistories)
                .HasForeignKey(rsh => rsh.RequestId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(rsh => rsh.ChangedByMember)
                .WithMany(tm => tm.StatusChanges)
                .HasForeignKey(rsh => rsh.ChangedBy)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Seed initial admin user
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed admin user with hashed password (Password: "1")
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Name = "Admin",
                Email = "dhwanitakoliya10@gmail.com",
                Password = BCrypt.Net.BCrypt.HashPassword("1"),
                UserType = "Admin"
            }
        );
    }
}
