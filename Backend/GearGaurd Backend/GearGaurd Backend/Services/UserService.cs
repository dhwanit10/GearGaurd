using GearGaurd_Backend.Data;
using GearGaurd_Backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace GearGaurd_Backend.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserResponseDto>> GetAllNonAdminUsersAsync()
    {
        var users = await _context.Users
            .AsNoTracking()
            .Where(u => u.UserType != "Admin")
            .Select(u => new UserResponseDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                UserType = u.UserType
            })
            .ToListAsync();

        return users;
    }
}
