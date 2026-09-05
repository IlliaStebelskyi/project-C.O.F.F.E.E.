using Microsoft.AspNetCore.Identity;
using project_coffee.Models;
using project_coffee.Services.Interfaces;

namespace project_coffee.Services;

public class HashPassword : IPasswordHasher1<User>
{
    public PasswordVerificationResult VerifyHashedPassword(User user, string providedPassword, string hashedPassword)
    {
        bool isValid = BCrypt.Net.BCrypt.Verify(hashedPassword, providedPassword);
        return isValid ? PasswordVerificationResult.Success : PasswordVerificationResult.Failed;

    }

    string IPasswordHasher1<User>.HashPassword(User user, string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
    }
}