using project_coffee.Models;
using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;

namespace project_coffee.Services.Interfaces;

public interface IOrderService
{
    Task<OrderResponseDto> CreateOrderAsync(Guid userId, CreateOrderRequestDto request);
    Task<OrderResponseDto> UpdateOrderAsync(Guid id, Guid userId, CreateOrderRequestDto request);
    Task<OrderResponseDto> GetByIdAsync(Guid id);
    Task<ICollection<OrderResponseDto>> GetUserOrderAsync(Guid userId);
    Task<ICollection<OrderResponseDto>> GetAllOrdersAsync();
    Task<OrderResponseDto> UpdateStatusAsync(Guid id, OrderStatus newStatus);
    Task DeleteOrder(Guid id);
}