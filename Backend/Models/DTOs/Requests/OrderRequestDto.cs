namespace project_coffee.Models.DTOs.Requests;

public record OrderItemRequestDto(Guid ProductId, int Quantity, string? SpecialRequests);

public record CreateOrderRequestDto(List<OrderItemRequestDto> Items, DateTime ExpectedPickupTime);
