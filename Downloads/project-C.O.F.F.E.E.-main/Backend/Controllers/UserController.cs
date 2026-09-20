using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using project_coffee.Helpers;
using project_coffee.Models;
using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;
using project_coffee.Services.Interfaces;

namespace project_coffee.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController(IUserService userService) : ControllerBase
{
    private readonly IUserService _userService = userService;
    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new UnauthorizedAccessException("User ID claim not found.");
        return Guid.Parse(claim);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        try
        {
            var userId = GetUserId();
            var profile = await _userService.GetProfileAsync(userId);
            return Ok(new ApiResponse<UserProfileResponseDto> { Success = true, Data = profile });
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "User not found." });
        }
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe(UserProfileRequestDto request)
    {
        try
        {
            var userId = GetUserId();
            var updated = await _userService.UpdateProfileAsync(userId, request);
            return Ok(new ApiResponse<UserProfileResponseDto> { Success = true, Data = updated });
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "User not found." });
        }
    }
}