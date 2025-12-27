using GearGaurd_Backend.Data;
using GearGaurd_Backend.DTOs;
using GearGaurd_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace GearGaurd_Backend.Services;

public class EquipmentService : IEquipmentService
{
    private readonly ApplicationDbContext _context;

    public EquipmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EquipmentResponseDto?> CreateEquipmentAsync(CreateEquipmentRequestDto request)
    {
        // Validate foreign key references exist
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        var teamExists = await _context.Teams.AnyAsync(t => t.Id == request.MaintenanceTeamId);
        var ownerExists = await _context.Users.AnyAsync(u => u.Id == request.OwnedBy);

        if (!categoryExists || !teamExists || !ownerExists)
        {
            return null;
        }

        var equipment = new Equipment
        {
            Name = request.Name,
            SerialNo = request.SerialNo,
            Department = request.Department,
            CategoryId = request.CategoryId,
            Location = request.Location,
            MaintenanceTeamId = request.MaintenanceTeamId,
            Status = request.Status,
            PurchaseDate = request.PurchaseDate,
            WarrantyEnd = request.WarrantyEnd,
            OwnedBy = request.OwnedBy
        };

        _context.Equipment.Add(equipment);
        await _context.SaveChangesAsync();

        // Load related data and return
        return await GetEquipmentByIdAsync(equipment.Id);
    }

    public async Task<EquipmentResponseDto?> GetEquipmentByIdAsync(int id)
    {
        var equipment = await _context.Equipment
            .AsNoTracking()
            .Include(e => e.Category)
            .Include(e => e.MaintenanceTeam)
            .Include(e => e.Owner)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (equipment == null)
        {
            return null;
        }

        return MapToResponseDto(equipment);
    }

    public async Task<List<EquipmentResponseDto>> GetAllEquipmentAsync()
    {
        var equipmentList = await _context.Equipment
            .AsNoTracking()
            .Include(e => e.Category)
            .Include(e => e.MaintenanceTeam)
            .Include(e => e.Owner)
            .ToListAsync();

        return equipmentList.Select(MapToResponseDto).ToList();
    }

    public async Task<EquipmentResponseDto?> UpdateEquipmentAsync(UpdateEquipmentRequestDto request)
    {
        var equipment = await _context.Equipment
            .FirstOrDefaultAsync(e => e.Id == request.Id);

        if (equipment == null)
        {
            return null;
        }

        // Validate foreign key references exist
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        var teamExists = await _context.Teams.AnyAsync(t => t.Id == request.MaintenanceTeamId);
        var ownerExists = await _context.Users.AnyAsync(u => u.Id == request.OwnedBy);

        if (!categoryExists || !teamExists || !ownerExists)
        {
            return null;
        }

        equipment.Name = request.Name;
        equipment.SerialNo = request.SerialNo;
        equipment.Department = request.Department;
        equipment.CategoryId = request.CategoryId;
        equipment.Location = request.Location;
        equipment.MaintenanceTeamId = request.MaintenanceTeamId;
        equipment.Status = request.Status;
        equipment.PurchaseDate = request.PurchaseDate;
        equipment.WarrantyEnd = request.WarrantyEnd;
        equipment.OwnedBy = request.OwnedBy;

        await _context.SaveChangesAsync();

        // Load related data and return
        return await GetEquipmentByIdAsync(equipment.Id);
    }

    public async Task<DeleteResponseDto> DeleteEquipmentAsync(int id)
    {
        var equipment = await _context.Equipment
            .FirstOrDefaultAsync(e => e.Id == id);

        if (equipment == null)
        {
            return new DeleteResponseDto
            {
                Success = false,
                Message = "Equipment not found"
            };
        }

        _context.Equipment.Remove(equipment);
        await _context.SaveChangesAsync();

        return new DeleteResponseDto
        {
            Success = true,
            Message = "Equipment deleted successfully"
        };
    }

    private static EquipmentResponseDto MapToResponseDto(Equipment equipment)
    {
        return new EquipmentResponseDto
        {
            Id = equipment.Id,
            Name = equipment.Name,
            SerialNo = equipment.SerialNo,
            Department = equipment.Department,
            Location = equipment.Location,
            Status = equipment.Status,
            PurchaseDate = equipment.PurchaseDate,
            WarrantyEnd = equipment.WarrantyEnd,
            Category = new CategoryDetailsDto
            {
                Id = equipment.Category.Id,
                Name = equipment.Category.Name,
                Description = equipment.Category.Description
            },
            MaintenanceTeam = new TeamDetailsDto
            {
                Id = equipment.MaintenanceTeam.Id,
                TeamName = equipment.MaintenanceTeam.TeamName,
                Description = equipment.MaintenanceTeam.Description
            },
            Owner = new OwnerDetailsDto
            {
                Id = equipment.Owner.Id,
                Name = equipment.Owner.Name,
                Email = equipment.Owner.Email,
                UserType = equipment.Owner.UserType
            }
        };
    }
}
