namespace project_coffee.Models.DTOs.Responses;

public record CartItemResponseDto(Guid ProductId, string ProductName, decimal Price, bool IsAvailable, int Quantity, string? SpecialRequests);

public record CartResponseDto(Guid Id, List<CartItemResponseDto> Items, decimal TotalAmount);