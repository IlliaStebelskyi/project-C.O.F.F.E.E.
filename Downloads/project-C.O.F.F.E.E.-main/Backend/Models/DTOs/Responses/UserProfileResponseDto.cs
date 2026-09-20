namespace project_coffee.Models.DTOs.Responses;

public record UserProfileResponseDto(string Email, string Name, string LastName, string? Phone, DateTime? BirthDate, string? Preferences, string Role);