using GearGaurd_Backend.DTOs;

namespace GearGaurd_Backend.Services;

public interface IMaintenanceRequestService
{
    Task<MaintenanceRequestResponseDto?> CreateMaintenanceRequestAsync(CreateMaintenanceRequestDto request);
    Task<MaintenanceRequestResponseDto?> GetMaintenanceRequestByIdAsync(int id);
    Task<List<MaintenanceRequestResponseDto>> GetAllMaintenanceRequestsAsync();
    Task<MaintenanceRequestResponseDto?> UpdateMaintenanceRequestAsync(UpdateMaintenanceRequestDto request);
    Task<DeleteResponseDto> DeleteMaintenanceRequestAsync(int id);
}
