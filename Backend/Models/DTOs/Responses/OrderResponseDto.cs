namespace project_coffee.Models.DTOs.Responses;

public record OrderItemResponseDto(Guid ProductId, string ProductName, int Quantity, decimal CurrentPrice, string? SpecialRequests);

public record OrderResponseDto(Guid Id, Guid UserId, string Status, decimal TotalAmount, DateTime ExpectedPickupTime, DateTime CreatedAt, List<OrderItemResponseDto> Items);