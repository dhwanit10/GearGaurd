using GearGaurd_Backend.DTOs;
using GearGaurd_Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace GearGaurd_Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipmentController : ControllerBase
{
    private readonly IEquipmentService _equipmentService;

    public EquipmentController(IEquipmentService equipmentService)
    {
        _equipmentService = equipmentService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateEquipment([FromBody] CreateEquipmentRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _equipmentService.CreateEquipmentAsync(request);

        if (result == null)
        {
            return BadRequest(new { message = "Invalid CategoryId, MaintenanceTeamId, or OwnedBy reference" });
        }

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEquipmentById(int id)
    {
        var result = await _equipmentService.GetEquipmentByIdAsync(id);

        if (result == null)
        {
            return NotFound(new { message = "Equipment not found" });
        }

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllEquipment()
    {
        var result = await _equipmentService.GetAllEquipmentAsync();
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateEquipment([FromBody] UpdateEquipmentRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _equipmentService.UpdateEquipmentAsync(request);

        if (result == null)
        {
            return NotFound(new { message = "Equipment not found or invalid foreign key references" });
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEquipment(int id)
    {
        var result = await _equipmentService.DeleteEquipmentAsync(id);

        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }
}
