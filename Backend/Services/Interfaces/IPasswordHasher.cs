using Microsoft.AspNetCore.Identity;

namespace project_coffee.Services.Interfaces;

public interface IPasswordHasher1<TUser> where TUser : class
{
    string HashPassword(TUser user, string password);
    PasswordVerificationResult VerifyHashedPassword(TUser user, string providedPassword, string hashedPassword);
}