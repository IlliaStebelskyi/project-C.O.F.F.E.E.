namespace project_coffee.Models.DTOs.Requests;

public record RegisterRequestDto(string Email, string Password, string Name, string LastName);