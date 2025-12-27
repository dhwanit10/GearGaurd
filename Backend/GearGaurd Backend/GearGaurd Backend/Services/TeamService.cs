using GearGaurd_Backend.Data;
using GearGaurd_Backend.DTOs;
using GearGaurd_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace GearGaurd_Backend.Services;

public class TeamService : ITeamService
{
    private readonly ApplicationDbContext _context;

    public TeamService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TeamResponseDto> CreateTeamAsync(CreateTeamRequestDto request)
    {
        var team = new Team
        {
            TeamName = request.TeamName,
            Description = request.Description
        };

        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        return new TeamResponseDto
        {
            Id = team.Id,
            TeamName = team.TeamName,
            Description = team.Description
        };
    }

    public async Task<TeamResponseDto?> GetTeamByIdAsync(int id)
    {
        var team = await _context.Teams
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        if (team == null)
        {
            return null;
        }

        return new TeamResponseDto
        {
            Id = team.Id,
            TeamName = team.TeamName,
            Description = team.Description
        };
    }

    public async Task<List<TeamResponseDto>> GetAllTeamsAsync()
    {
        var teams = await _context.Teams
            .AsNoTracking()
            .Select(t => new TeamResponseDto
            {
                Id = t.Id,
                TeamName = t.TeamName,
                Description = t.Description
            })
            .ToListAsync();

        return teams;
    }

    public async Task<TeamResponseDto?> UpdateTeamAsync(UpdateTeamRequestDto request)
    {
        var team = await _context.Teams
            .FirstOrDefaultAsync(t => t.Id == request.Id);

        if (team == null)
        {
            return null;
        }

        team.TeamName = request.TeamName;
        team.Description = request.Description;

        await _context.SaveChangesAsync();

        return new TeamResponseDto
        {
            Id = team.Id,
            TeamName = team.TeamName,
            Description = team.Description
        };
    }

    public async Task<DeleteResponseDto> DeleteTeamAsync(int id)
    {
        var team = await _context.Teams
            .FirstOrDefaultAsync(t => t.Id == id);

        if (team == null)
        {
            return new DeleteResponseDto
            {
                Success = false,
                Message = "Team not found"
            };
        }

        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();

        return new DeleteResponseDto
        {
            Success = true,
            Message = "Team deleted successfully"
        };
    }
}
