using GearGaurd_Backend.DTOs;

namespace GearGaurd_Backend.Services;

public interface IUserService
{
    Task<List<UserResponseDto>> GetAllNonAdminUsersAsync();
}
