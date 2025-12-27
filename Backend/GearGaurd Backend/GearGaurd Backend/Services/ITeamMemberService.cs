using GearGaurd_Backend.DTOs;

namespace GearGaurd_Backend.Services;

public interface ITeamMemberService
{
    Task<TeamMemberResponseDto?> CreateTeamMemberAsync(CreateTeamMemberRequestDto request);
    Task<TeamMemberResponseDto?> GetTeamMemberByIdAsync(int id);
    Task<List<TeamMemberResponseDto>> GetAllTeamMembersAsync();
    Task<TeamMemberResponseDto?> UpdateTeamMemberAsync(UpdateTeamMemberRequestDto request);
    Task<DeleteResponseDto> DeleteTeamMemberAsync(int id);
}
