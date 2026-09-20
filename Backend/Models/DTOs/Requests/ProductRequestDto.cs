namespace project_coffee.Models.DTOs.Requests;

public record ProductRequestDto(string Name, string Description, decimal Price, string ImageUrl, bool IsAvailable, Guid CategoryId);