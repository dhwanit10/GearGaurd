using GearGaurd_Backend.DTOs;
using GearGaurd_Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace GearGaurd_Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamMemberController : ControllerBase
{
    private readonly ITeamMemberService _teamMemberService;

    public TeamMemberController(ITeamMemberService teamMemberService)
    {
        _teamMemberService = teamMemberService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTeamMember([FromBody] CreateTeamMemberRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _teamMemberService.CreateTeamMemberAsync(request);

        if (result == null)
        {
            return BadRequest(new { message = "Invalid TeamId or UserId, or member already exists" });
        }

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTeamMemberById(int id)
    {
        var result = await _teamMemberService.GetTeamMemberByIdAsync(id);

        if (result == null)
        {
            return NotFound(new { message = "Team member not found" });
        }

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTeamMembers()
    {
        var result = await _teamMemberService.GetAllTeamMembersAsync();
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateTeamMember([FromBody] UpdateTeamMemberRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _teamMemberService.UpdateTeamMemberAsync(request);

        if (result == null)
        {
            return NotFound(new { message = "Team member not found or invalid references, or duplicate member" });
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeamMember(int id)
    {
        var result = await _teamMemberService.DeleteTeamMemberAsync(id);

        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }
}
