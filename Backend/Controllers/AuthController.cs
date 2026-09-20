
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using project_coffee.Helpers;
using project_coffee.Models.DTOs.Requests;
using project_coffee.Services.Interfaces;

namespace project_coffee.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    private readonly IAuthService _authService = authService;

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequestDto request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            SetAuthCookie(result.RefreshToken);
            return Ok(new ApiResponse<object> { Success = true, Data = new { accessToken = result.AccessToken } });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Data = new { message = ex.Message } });
        }
    }

    [AllowAnonymous]
    [HttpPost("refresh")]

    public async Task<IActionResult> RefreshToken()
    {
        if (!Request.Cookies.TryGetValue("refreshToken", out var token))
        {
            return Unauthorized(new { message = "Session expired or no refresh token found." });
        }

        try
        {
            var result = await _authService.RefreshTokens(token);
            SetAuthCookie(result.RefreshToken);
            return Ok(new ApiResponse<object> { Success = true, Data = new { accessToken = result.AccessToken } });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Data = new { message = ex.Message } });
        }
    }


    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            SetAuthCookie(result.RefreshToken);
            return Ok(new ApiResponse<object> { Success = true, Data = new { accessToken = result.AccessToken } });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Data = new { message = ex.Message } });
        }
    }
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        try
        {
            if (Request.Cookies.TryGetValue("refreshToken", out var token))
            {
                await _authService.Logout(token);
            }
        }
        catch (ArgumentException)
        {
            
        }

        Response.Cookies.Delete("refreshToken");
        return Ok(new ApiResponse<object> { Success = true, Message = "Logout out successfully." });
    }


    [NonAction]
    private void SetAuthCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax
        };
        Response.Cookies.Append("refreshToken", token, cookieOptions);
    }
}