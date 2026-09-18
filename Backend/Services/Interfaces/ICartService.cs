using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;

namespace project_coffee.Services.Interfaces;

public interface ICartService
{
    Task<CartResponseDto> GetCartAsync(Guid userId);
    Task<CartResponseDto> AddItemAsync(Guid userId, AddCartItemRequestDto request);
    Task<CartResponseDto> UpdateItemAsync(Guid userId, Guid productId, UpdateCartItemRequestDto request);
    Task<CartResponseDto> RemoveItemAsync(Guid userId, Guid productId);
    Task ClearCartAsync(Guid userId);
}
