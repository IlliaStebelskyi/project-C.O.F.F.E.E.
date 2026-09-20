namespace project_coffee.Models.DTOs.Requests;

public record AddCartItemRequestDto(Guid ProductId, int Quantity, string? SpecialRequests);

public record UpdateCartItemRequestDto(int Quantity, string? SpecialRequests);