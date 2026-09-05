
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using project_coffee.Models;
using project_coffee.Services.Interfaces;

namespace project_coffee.Services;

internal sealed class TokenService(IConfiguration configuration) : ITokenService
{
    public string GenerateAccessToken(User user)
    {
        string signingKey = configuration["JwtData:SigningKey"]!;
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            ]),
            Expires = DateTime.UtcNow.AddHours(configuration.GetValue<int>("JwtData:ExpirationInHours")),
            SigningCredentials = credentials,
            Issuer = configuration["JwtData:Issuer"],
            Audience = configuration["JwtData:Audience"]
        };

        var handler = new Microsoft.IdentityModel.JsonWebTokens.JsonWebTokenHandler();
        string token = handler.CreateToken(tokenDescriptor);
        return token;
    }

    public string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
    }
}