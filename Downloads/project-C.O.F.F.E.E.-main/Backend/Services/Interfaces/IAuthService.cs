using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;

namespace project_coffee.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken token = default);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken token = default);
    Task Logout(string token);
    Task<AuthResponseDto> RefreshTokens(string token);
}