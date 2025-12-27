using GearGaurd_Backend.Data;
using GearGaurd_Backend.DTOs;
using GearGaurd_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace GearGaurd_Backend.Services;

public class CategoryService : ICategoryService
{
    private readonly ApplicationDbContext _context;

    public CategoryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CategoryResponseDto?> CreateCategoryAsync(CreateCategoryRequestDto request)
    {
        // Validate that the team exists
        var teamExists = await _context.Teams.AnyAsync(t => t.Id == request.TeamId);

        if (!teamExists)
        {
            return null;
        }

        var category = new Category
        {
            Name = request.Name,
            Description = request.Description,
            TeamId = request.TeamId
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        // Load related data and return
        return await GetCategoryByIdAsync(category.Id);
    }

    public async Task<CategoryResponseDto?> GetCategoryByIdAsync(int id)
    {
        var category = await _context.Categories
            .AsNoTracking()
            .Include(c => c.Team)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            return null;
        }

        return MapToResponseDto(category);
    }

    public async Task<List<CategoryResponseDto>> GetAllCategoriesAsync()
    {
        var categories = await _context.Categories
            .AsNoTracking()
            .Include(c => c.Team)
            .ToListAsync();

        return categories.Select(MapToResponseDto).ToList();
    }

    public async Task<CategoryResponseDto?> UpdateCategoryAsync(UpdateCategoryRequestDto request)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == request.Id);

        if (category == null)
        {
            return null;
        }

        // Validate that the team exists
        var teamExists = await _context.Teams.AnyAsync(t => t.Id == request.TeamId);

        if (!teamExists)
        {
            return null;
        }

        category.Name = request.Name;
        category.Description = request.Description;
        category.TeamId = request.TeamId;

        await _context.SaveChangesAsync();

        // Load related data and return
        return await GetCategoryByIdAsync(category.Id);
    }

    public async Task<DeleteResponseDto> DeleteCategoryAsync(int id)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            return new DeleteResponseDto
            {
                Success = false,
                Message = "Category not found"
            };
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return new DeleteResponseDto
        {
            Success = true,
            Message = "Category deleted successfully"
        };
    }

    private static CategoryResponseDto MapToResponseDto(Category category)
    {
        return new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            Team = new TeamDetailsDto
            {
                Id = category.Team.Id,
                TeamName = category.Team.TeamName,
                Description = category.Team.Description
            }
        };
    }
}
