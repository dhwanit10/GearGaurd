using GearGaurd_Backend.DTOs;

namespace GearGaurd_Backend.Services;

public interface ITeamService
{
    Task<TeamResponseDto> CreateTeamAsync(CreateTeamRequestDto request);
    Task<TeamResponseDto?> GetTeamByIdAsync(int id);
    Task<List<TeamResponseDto>> GetAllTeamsAsync();
    Task<TeamResponseDto?> UpdateTeamAsync(UpdateTeamRequestDto request);
    Task<DeleteResponseDto> DeleteTeamAsync(int id);
}
