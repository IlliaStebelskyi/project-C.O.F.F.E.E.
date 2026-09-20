using project_coffee.Models;

namespace project_coffee.Services.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}

