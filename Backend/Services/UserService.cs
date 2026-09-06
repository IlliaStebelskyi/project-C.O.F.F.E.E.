using Microsoft.EntityFrameworkCore;
using project_coffee.Data;
using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;
using project_coffee.Services.Interfaces;

namespace project_coffee.Services;

public class UserService(ApplicationDbContext applicationDbContext) : IUserService
{
    private readonly ApplicationDbContext _applicationDbContext = applicationDbContext;

    public async Task<UserProfileResponseDto> GetProfileAsync(Guid userId)
    {
        var findUser = await _applicationDbContext.Users
            .Include(c => c.UserProfile)
            .FirstOrDefaultAsync(c => c.Id == userId) ?? throw new KeyNotFoundException();

        var userProfile = new UserProfileResponseDto(
            findUser.Email,
            findUser.UserProfile!.Name,
            findUser.UserProfile.LastName,
            findUser.UserProfile.Phone,
            findUser.UserProfile.BirthDate,
            findUser.UserProfile.Preferences,
            findUser.Role.ToString()
        );

        return userProfile;
    }

    public async Task<UserProfileResponseDto> UpdateProfileAsync(Guid userId, UserProfileRequestDto request)
    {
        var findUser = await _applicationDbContext.Users.Include(c => c.UserProfile).FirstOrDefaultAsync(c => c.Id == userId) ?? throw new KeyNotFoundException();

        findUser.UserProfile!.Name = request.Name;
        findUser.UserProfile.LastName = request.LastName;
        findUser.UserProfile.Phone = request.Phone;
        findUser.UserProfile.BirthDate = request.BirthDate.HasValue
       ? DateTime.SpecifyKind(request.BirthDate.Value, DateTimeKind.Utc)
       : findUser.UserProfile.BirthDate;
        findUser.UserProfile.Preferences = request.Preferences;

        await _applicationDbContext.SaveChangesAsync();

        var userProfile = new UserProfileResponseDto(
            findUser.Email,
            findUser.UserProfile.Name,
            findUser.UserProfile.LastName,
            findUser.UserProfile.Phone,
            findUser.UserProfile.BirthDate,
            findUser.UserProfile.Preferences,
            findUser.Role.ToString()
        );

        return userProfile;
    }
}