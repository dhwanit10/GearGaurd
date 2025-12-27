using GearGaurd_Backend.Data;
using GearGaurd_Backend.DTOs;
using GearGaurd_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace GearGaurd_Backend.Services;

public class TeamMemberService : ITeamMemberService
{
    private readonly ApplicationDbContext _context;

    public TeamMemberService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TeamMemberResponseDto?> CreateTeamMemberAsync(CreateTeamMemberRequestDto request)
    {
        var teamExists = await _context.Teams.AnyAsync(t => t.Id == request.TeamId);
        var userExists = await _context.Users.AnyAsync(u => u.Id == request.UserId);

        if (!teamExists || !userExists)
        {
            return null;
        }

        var existingMember = await _context.TeamMembers
            .AnyAsync(tm => tm.TeamId == request.TeamId && tm.UserId == request.UserId);

        if (existingMember)
        {
            return null;
        }

        var teamMember = new TeamMember
        {
            TeamId = request.TeamId,
            UserId = request.UserId
        };

        _context.TeamMembers.Add(teamMember);
        await _context.SaveChangesAsync();

        return await GetTeamMemberByIdAsync(teamMember.Id);
    }

    public async Task<TeamMemberResponseDto?> GetTeamMemberByIdAsync(int id)
    {
        var teamMember = await _context.TeamMembers
            .AsNoTracking()
            .Include(tm => tm.Team)
            .Include(tm => tm.User)
            .FirstOrDefaultAsync(tm => tm.Id == id);

        if (teamMember == null)
        {
            return null;
        }

        return MapToResponseDto(teamMember);
    }

    public async Task<List<TeamMemberResponseDto>> GetAllTeamMembersAsync()
    {
        var teamMembers = await _context.TeamMembers
            .AsNoTracking()
            .Include(tm => tm.Team)
            .Include(tm => tm.User)
            .ToListAsync();

        return teamMembers.Select(MapToResponseDto).ToList();
    }

    public async Task<TeamMemberResponseDto?> UpdateTeamMemberAsync(UpdateTeamMemberRequestDto request)
    {
        var teamMember = await _context.TeamMembers
            .FirstOrDefaultAsync(tm => tm.Id == request.Id);

        if (teamMember == null)
        {
            return null;
        }

        var teamExists = await _context.Teams.AnyAsync(t => t.Id == request.TeamId);
        var userExists = await _context.Users.AnyAsync(u => u.Id == request.UserId);

        if (!teamExists || !userExists)
        {
            return null;
        }

        var existingMember = await _context.TeamMembers
            .AnyAsync(tm => tm.Id != request.Id && tm.TeamId == request.TeamId && tm.UserId == request.UserId);

        if (existingMember)
        {
            return null;
        }

        teamMember.TeamId = request.TeamId;
        teamMember.UserId = request.UserId;

        await _context.SaveChangesAsync();

        return await GetTeamMemberByIdAsync(teamMember.Id);
    }

    public async Task<DeleteResponseDto> DeleteTeamMemberAsync(int id)
    {
        var teamMember = await _context.TeamMembers
            .FirstOrDefaultAsync(tm => tm.Id == id);

        if (teamMember == null)
        {
            return new DeleteResponseDto
            {
                Success = false,
                Message = "Team member not found"
            };
        }

        _context.TeamMembers.Remove(teamMember);
        await _context.SaveChangesAsync();

        return new DeleteResponseDto
        {
            Success = true,
            Message = "Team member deleted successfully"
        };
    }

    private static TeamMemberResponseDto MapToResponseDto(TeamMember teamMember)
    {
        return new TeamMemberResponseDto
        {
            Id = teamMember.Id,
            Team = new TeamDetailsDto
            {
                Id = teamMember.Team.Id,
                TeamName = teamMember.Team.TeamName,
                Description = teamMember.Team.Description
            },
            User = new UserDetailsDto
            {
                Id = teamMember.User.Id,
                Name = teamMember.User.Name,
                Email = teamMember.User.Email,
                UserType = teamMember.User.UserType
            }
        };
    }
}
