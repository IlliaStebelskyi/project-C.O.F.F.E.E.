namespace project_coffee.Models.DTOs.Requests;

public record UserProfileRequestDto(string Name, string LastName, string? Phone, DateTime? BirthDate, string? Preferences);