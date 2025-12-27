using GearGaurd_Backend.DTOs;

namespace GearGaurd_Backend.Services;

public interface ICategoryService
{
    Task<CategoryResponseDto?> CreateCategoryAsync(CreateCategoryRequestDto request);
    Task<CategoryResponseDto?> GetCategoryByIdAsync(int id);
    Task<List<CategoryResponseDto>> GetAllCategoriesAsync();
    Task<CategoryResponseDto?> UpdateCategoryAsync(UpdateCategoryRequestDto request);
    Task<DeleteResponseDto> DeleteCategoryAsync(int id);
}
