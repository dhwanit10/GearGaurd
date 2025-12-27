using GearGaurd_Backend.DTOs;

namespace GearGaurd_Backend.Services;

public interface IEquipmentService
{
    Task<EquipmentResponseDto?> CreateEquipmentAsync(CreateEquipmentRequestDto request);
    Task<EquipmentResponseDto?> GetEquipmentByIdAsync(int id);
    Task<List<EquipmentResponseDto>> GetAllEquipmentAsync();
    Task<EquipmentResponseDto?> UpdateEquipmentAsync(UpdateEquipmentRequestDto request);
    Task<DeleteResponseDto> DeleteEquipmentAsync(int id);
}
