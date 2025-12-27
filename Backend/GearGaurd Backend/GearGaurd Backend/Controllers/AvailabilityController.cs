using GearGaurd_Backend.DTOs;
using GearGaurd_Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace GearGaurd_Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AvailabilityController : ControllerBase
{
    private readonly IAvailabilityService _availabilityService;

    public AvailabilityController(IAvailabilityService availabilityService)
    {
        _availabilityService = availabilityService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAvailability([FromBody] CreateAvailabilityRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _availabilityService.CreateAvailabilityAsync(request);

        if (result == null)
        {
            return BadRequest(new { message = "Invalid TeamMemberId reference" });
        }

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAvailabilityById(int id)
    {
        var result = await _availabilityService.GetAvailabilityByIdAsync(id);

        if (result == null)
        {
            return NotFound(new { message = "Availability not found" });
        }

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAvailabilities()
    {
        var result = await _availabilityService.GetAllAvailabilitiesAsync();
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAvailability([FromBody] UpdateAvailabilityRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _availabilityService.UpdateAvailabilityAsync(request);

        if (result == null)
        {
            return NotFound(new { message = "Availability not found or invalid TeamMemberId reference" });
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAvailability(int id)
    {
        var result = await _availabilityService.DeleteAvailabilityAsync(id);

        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }
}
