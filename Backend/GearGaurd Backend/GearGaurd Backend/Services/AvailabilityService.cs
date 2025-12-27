using GearGaurd_Backend.Data;
using GearGaurd_Backend.DTOs;
using GearGaurd_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace GearGaurd_Backend.Services;

public class AvailabilityService : IAvailabilityService
{
    private readonly ApplicationDbContext _context;

    public AvailabilityService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AvailabilityResponseDto?> CreateAvailabilityAsync(CreateAvailabilityRequestDto request)
    {
        var teamMemberExists = await _context.TeamMembers.AnyAsync(tm => tm.Id == request.TeamMemberId);

        if (!teamMemberExists)
        {
            return null;
        }

        var availability = new Availability
        {
            TeamMemberId = request.TeamMemberId
        };

        _context.Availabilities.Add(availability);
        await _context.SaveChangesAsync();

        return await GetAvailabilityByIdAsync(availability.Id);
    }

    public async Task<AvailabilityResponseDto?> GetAvailabilityByIdAsync(int id)
    {
        var availability = await _context.Availabilities
            .AsNoTracking()
            .Include(a => a.TeamMember)
                .ThenInclude(tm => tm.Team)
            .Include(a => a.TeamMember)
                .ThenInclude(tm => tm.User)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (availability == null)
        {
            return null;
        }

        return MapToResponseDto(availability);
    }

    public async Task<List<AvailabilityResponseDto>> GetAllAvailabilitiesAsync()
    {
        var availabilities = await _context.Availabilities
            .AsNoTracking()
            .Include(a => a.TeamMember)
                .ThenInclude(tm => tm.Team)
            .Include(a => a.TeamMember)
                .ThenInclude(tm => tm.User)
            .ToListAsync();

        return availabilities.Select(MapToResponseDto).ToList();
    }

    public async Task<AvailabilityResponseDto?> UpdateAvailabilityAsync(UpdateAvailabilityRequestDto request)
    {
        var availability = await _context.Availabilities
            .FirstOrDefaultAsync(a => a.Id == request.Id);

        if (availability == null)
        {
            return null;
        }

        var teamMemberExists = await _context.TeamMembers.AnyAsync(tm => tm.Id == request.TeamMemberId);

        if (!teamMemberExists)
        {
            return null;
        }

        availability.TeamMemberId = request.TeamMemberId;

        await _context.SaveChangesAsync();

        return await GetAvailabilityByIdAsync(availability.Id);
    }

    public async Task<DeleteResponseDto> DeleteAvailabilityAsync(int id)
    {
        var availability = await _context.Availabilities
            .FirstOrDefaultAsync(a => a.Id == id);

        if (availability == null)
        {
            return new DeleteResponseDto
            {
                Success = false,
                Message = "Availability not found"
            };
        }

        _context.Availabilities.Remove(availability);
        await _context.SaveChangesAsync();

        return new DeleteResponseDto
        {
            Success = true,
            Message = "Availability deleted successfully"
        };
    }

    private static AvailabilityResponseDto MapToResponseDto(Availability availability)
    {
        return new AvailabilityResponseDto
        {
            Id = availability.Id,
            TeamMember = new TeamMemberDetailsDto
            {
                Id = availability.TeamMember.Id,
                Team = new TeamDetailsDto
                {
                    Id = availability.TeamMember.Team.Id,
                    TeamName = availability.TeamMember.Team.TeamName,
                    Description = availability.TeamMember.Team.Description
                },
                User = new UserDetailsDto
                {
                    Id = availability.TeamMember.User.Id,
                    Name = availability.TeamMember.User.Name,
                    Email = availability.TeamMember.User.Email,
                    UserType = availability.TeamMember.User.UserType
                }
            }
        };
    }
}
