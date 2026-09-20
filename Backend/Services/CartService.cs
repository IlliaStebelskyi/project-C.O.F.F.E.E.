using Microsoft.EntityFrameworkCore;
using project_coffee.Data;
using project_coffee.Exceptions;
using project_coffee.Models;
using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;
using project_coffee.Services.Interfaces;

namespace project_coffee.Services;

public class CartService(ApplicationDbContext applicationDbContext) : ICartService
{
    private readonly ApplicationDbContext _applicationDbContext = applicationDbContext;

    private async Task<Cart> GetOrCreateCartAsync(Guid userId)
    {
        var cart = await _applicationDbContext.Carts
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart != null)
            return cart;

        cart = new Cart { UserId = userId };
        _applicationDbContext.Carts.Add(cart);
        await _applicationDbContext.SaveChangesAsync();
        return cart;
    }

    private static CartResponseDto MapCartToResponse(Cart cart)
    {
        var items = cart.CartItems
            .Select(ci => new CartItemResponseDto(
                ci.ProductId,
                ci.Product!.Name,
                ci.Product.Price,
                ci.Product.IsAvailable,
                ci.Quantity,
                ci.SpecialRequests
            ))
            .ToList();

        var total = cart.CartItems.Sum(ci => ci.Product!.Price * ci.Quantity);

        return new CartResponseDto(cart.Id, items, total);
    }

    public async Task<CartResponseDto> GetCartAsync(Guid userId)
    {
        var cart = await GetOrCreateCartAsync(userId);
        return MapCartToResponse(cart);
    }

    public async Task<CartResponseDto> AddItemAsync(Guid userId, AddCartItemRequestDto request)
    {
        var cart = await GetOrCreateCartAsync(userId);

        var product = await _applicationDbContext.Products.FindAsync(request.ProductId)
            ?? throw new KeyNotFoundException("Product not found.");

        if (!product.IsAvailable)
            throw new ProductUnvailableException();

        var existingItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == request.ProductId);

        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
            existingItem.SpecialRequests = request.SpecialRequests ?? existingItem.SpecialRequests;
        }
        else
        {
            cart.CartItems.Add(new CartItem
            {
                CartId = cart.Id,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                SpecialRequests = request.SpecialRequests
            });
        }

        await _applicationDbContext.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task<CartResponseDto> UpdateItemAsync(Guid userId, Guid productId, UpdateCartItemRequestDto request)
    {
        var cart = await GetOrCreateCartAsync(userId);

        var item = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId)
            ?? throw new KeyNotFoundException("Item not found in cart.");

        if (request.Quantity <= 0)
        {
            cart.CartItems.Remove(item);
        }
        else
        {
            item.Quantity = request.Quantity;
            item.SpecialRequests = request.SpecialRequests;
        }

        await _applicationDbContext.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task<CartResponseDto> RemoveItemAsync(Guid userId, Guid productId)
    {
        var cart = await GetOrCreateCartAsync(userId);

        var item = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId);
        if (item != null)
        {
            cart.CartItems.Remove(item);
            await _applicationDbContext.SaveChangesAsync();
        }

        return await GetCartAsync(userId);
    }

    public async Task ClearCartAsync(Guid userId)
    {
        var cart = await GetOrCreateCartAsync(userId);
        cart.CartItems.Clear();
        await _applicationDbContext.SaveChangesAsync();
    }
}