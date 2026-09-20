namespace project_coffee.Models.DTOs.Responses;

public record ProductResponseDto(Guid Id, string Name, string Description, decimal Price, string ImageUrl, bool IsAvailable, Guid CategoryId, string CategoryName);