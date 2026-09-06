using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;

namespace project_coffee.Services.Interfaces;

public interface IUserService
{
    Task<UserProfileResponseDto> GetProfileAsync(Guid userId);
    Task<UserProfileResponseDto> UpdateProfileAsync(Guid userId, UserProfileRequestDto request);
}