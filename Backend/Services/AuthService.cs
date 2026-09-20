using Microsoft.EntityFrameworkCore;
using project_coffee.Data;
using project_coffee.Models;
using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;
using project_coffee.Services.Interfaces;

namespace project_coffee.Services;

public class AuthService(
    ApplicationDbContext applicationDbContext,
    ITokenService tokenService,
    IPasswordHasher1<User> passwordHasher) : IAuthService
{
    private readonly ApplicationDbContext _applicationDbContext = applicationDbContext;
    private readonly ITokenService _tokenService = tokenService;
    private readonly IPasswordHasher1<User> _passwordHasher = passwordHasher;

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken token = default)
    {
        if (await EmailExists(request.Email))
            throw new ArgumentException("Invalid data.");

        var hashedPassword = _passwordHasher.HashPassword(
            new User { Email = request.Email, Password = string.Empty },
            request.Password);

        var newUser = new User
        {
            Email = request.Email,
            Password = hashedPassword,
            UserProfile = new UserProfile
            {
                Name = request.Name,
                LastName = request.LastName
            }
        };

        _applicationDbContext.Users.Add(newUser);
        await _applicationDbContext.SaveChangesAsync(token);

        return await SaveRefreshToken(newUser);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken token = default)
    {
        var user = await _applicationDbContext.Users
            .FirstOrDefaultAsync(c => c.Email == request.Email, token)
            ?? throw new ArgumentException("Invalid email or password");

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
        if (!isPasswordValid)
            throw new ArgumentException("Invalid email or password.");

        return await SaveRefreshToken(user);
    }

    public async Task Logout(string token)
    {
        var refreshToken = await _applicationDbContext.RefreshTokens
            .FirstOrDefaultAsync(c => c.Token == token)
            ?? throw new ArgumentException("undefined");

        refreshToken.IsRevoked = true;
        await _applicationDbContext.SaveChangesAsync();
    }

    private async Task<bool> EmailExists(string email)
    {
        return await _applicationDbContext.Users.AnyAsync(c => c.Email == email);
    }

    private async Task<AuthResponseDto> SaveRefreshToken(User user)
    {
        var oldTokens = _applicationDbContext.RefreshTokens
            .Where(c => c.UserId == user.Id && !c.IsRevoked);
        _applicationDbContext.RefreshTokens.RemoveRange(oldTokens);

        var expiredTokens = _applicationDbContext.RefreshTokens
            .Where(x => x.ExpireOnUtc < DateTime.UtcNow);
        _applicationDbContext.RefreshTokens.RemoveRange(expiredTokens);

        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshTokenValue = _tokenService.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpireOnUtc = DateTime.UtcNow.AddHours(24)
        };

        _applicationDbContext.RefreshTokens.Add(refreshToken);
        await _applicationDbContext.SaveChangesAsync();

        return new AuthResponseDto(accessToken, refreshTokenValue);
    }

    public async Task<AuthResponseDto> RefreshTokens(string token)
    {
        var findToken = await _applicationDbContext.RefreshTokens
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Token == token)
            ?? throw new ArgumentException("Token not found");

        if (findToken.ExpireOnUtc < DateTime.UtcNow)
            throw new ArgumentException("Token expired.");
        if (findToken.IsRevoked)
            throw new ArgumentException("Token is revoked.");

        findToken.IsRevoked = true;
        await _applicationDbContext.SaveChangesAsync();

        return await SaveRefreshToken(findToken.User ?? throw new ArgumentException("User not found."));
    }
}