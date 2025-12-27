using GearGaurd_Backend.DTOs;

namespace GearGaurd_Backend.Services;

public interface IAvailabilityService
{
    Task<AvailabilityResponseDto?> CreateAvailabilityAsync(CreateAvailabilityRequestDto request);
    Task<AvailabilityResponseDto?> GetAvailabilityByIdAsync(int id);
    Task<List<AvailabilityResponseDto>> GetAllAvailabilitiesAsync();
    Task<AvailabilityResponseDto?> UpdateAvailabilityAsync(UpdateAvailabilityRequestDto request);
    Task<DeleteResponseDto> DeleteAvailabilityAsync(int id);
}
