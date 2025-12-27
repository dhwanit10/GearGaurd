using GearGaurd_Backend.DTOs;
using GearGaurd_Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace GearGaurd_Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamController : ControllerBase
{
    private readonly ITeamService _teamService;

    public TeamController(ITeamService teamService)
    {
        _teamService = teamService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTeam([FromBody] CreateTeamRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _teamService.CreateTeamAsync(request);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTeamById(int id)
    {
        var result = await _teamService.GetTeamByIdAsync(id);

        if (result == null)
        {
            return NotFound(new { message = "Team not found" });
        }

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTeams()
    {
        var result = await _teamService.GetAllTeamsAsync();
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateTeam([FromBody] UpdateTeamRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _teamService.UpdateTeamAsync(request);

        if (result == null)
        {
            return NotFound(new { message = "Team not found" });
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(int id)
    {
        var result = await _teamService.DeleteTeamAsync(id);

        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }
}
