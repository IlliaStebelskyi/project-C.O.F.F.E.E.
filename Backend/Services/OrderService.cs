using System.Xml.Schema;
using Microsoft.EntityFrameworkCore;
using project_coffee.Data;
using project_coffee.Exceptions;
using project_coffee.Models;
using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;
using project_coffee.Services.Interfaces;

namespace project_coffee.Services;

public class OrderService(ApplicationDbContext applicationDbContext) : IOrderService
{
    private readonly ApplicationDbContext _applicationDbContext = applicationDbContext;

    private async Task<Dictionary<Guid, Product>> GetProductsDictionaryAsync(List<OrderItemRequestDto> items)
    {
        var productIds = items.Select(i => i.ProductId).ToList();
        return await _applicationDbContext.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);
    }

    private static OrderResponseDto BuildOrderResponse(Order order, Dictionary<Guid, Product> products)
    {
        return new OrderResponseDto(
            order.Id,
            order.UserId!.Value,
            order.OrderStatus.ToString(),
            order.TotalAmount,
            order.ExpectedPickUpTime, 
            order.CreatedAt,
            [.. order.OrderProducts.Select(op => new OrderItemResponseDto(
                op.ProductId,
                products[op.ProductId].Name,
                op.Quantity,
                op.CurrentPrice,
                op.SpecialRequests
            ))]
        );
    }

    private static OrderResponseDto MapOrderToResponse(Order order)
    {
        return new OrderResponseDto(
            order.Id,
            order.UserId!.Value,
            order.OrderStatus.ToString(),
            order.TotalAmount,
            order.ExpectedPickUpTime,
            order.CreatedAt,
            [.. order.OrderProducts.Select(op => new OrderItemResponseDto(
                op.ProductId,
                op.Product!.Name,
                op.Quantity,
                op.CurrentPrice,
                op.SpecialRequests
            ))]
        );
    }

    public async Task<OrderResponseDto> CreateOrderAsync(Guid userId, CreateOrderRequestDto request)
    {
        var order = new Order
        {
            UserId = userId,
            ExpectedPickUpTime = DateTime.SpecifyKind(request.ExpectedPickupTime, DateTimeKind.Utc),
            OrderStatus = OrderStatus.Pending
        };

        var products = await GetProductsDictionaryAsync(request.Items);

        foreach (var item in request.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product))
                throw new KeyNotFoundException("Product not found");

            if (!product.IsAvailable)
                throw new ProductUnvailableException();

            var newOrder = new OrderProduct
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                CurrentPrice = product.Price,
                SpecialRequests = item.SpecialRequests
            };

            order.OrderProducts.Add(newOrder);

            order.TotalAmount += product.Price * item.Quantity;
        }

        _applicationDbContext.Orders.Add(order);
        await _applicationDbContext.SaveChangesAsync();

        return BuildOrderResponse(order, products);
    }

    public async Task DeleteOrder(Guid id)
    {
        var order = await _applicationDbContext.Orders
           .Include(c => c.OrderProducts)
               .ThenInclude(o => o.Product)
           .FirstOrDefaultAsync(s => s.Id == id)
           ?? throw new KeyNotFoundException("Order is not found.");

        _applicationDbContext.Orders.Remove(order);
        await _applicationDbContext.SaveChangesAsync();
    }

    public async Task<ICollection<OrderResponseDto>> GetAllOrdersAsync()
    {
        var orders = await _applicationDbContext.Orders
            .Include(c => c.OrderProducts)
                .ThenInclude(o => o.Product)
            .ToListAsync();

        return [.. orders.Select(MapOrderToResponse)];
    }

    public async Task<OrderResponseDto> GetByIdAsync(Guid id)
    {
        var order = await _applicationDbContext.Orders
            .Include(c => c.OrderProducts)
                .ThenInclude(o => o.Product)
            .FirstOrDefaultAsync(s => s.Id == id)
            ?? throw new KeyNotFoundException("Order is not found.");

        return MapOrderToResponse(order);
    }

    public async Task<ICollection<OrderResponseDto>> GetUserOrderAsync(Guid userId)
    {
        var orders = await _applicationDbContext.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderProducts)
                .ThenInclude(op => op.Product)
            .ToListAsync();

        return [..orders.Select(MapOrderToResponse)];
    }

    public async Task<OrderResponseDto> UpdateOrderAsync(Guid id, Guid userId, CreateOrderRequestDto request)
    {
        var order = await _applicationDbContext.Orders
            .Include(c => c.OrderProducts)
            .FirstOrDefaultAsync(s => s.Id == id)
            ?? throw new KeyNotFoundException("Order is not found");

        if (order.UserId != userId)
            throw new UnauthorizedAccessException("You can only edit your own orders.");

        if (order.OrderStatus != OrderStatus.Pending)
            throw new InvalidOperationException("Only pending orders can be updated.");

        _applicationDbContext.OrderProducts.RemoveRange(order.OrderProducts);
        order.OrderProducts.Clear();
        order.TotalAmount = 0;

        var products = await GetProductsDictionaryAsync(request.Items);

        foreach (var item in request.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product))
                throw new KeyNotFoundException("Product not found");

            if (!product.IsAvailable)
                throw new ProductUnvailableException();

            var orderProduct = new OrderProduct
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                CurrentPrice = product.Price,
                SpecialRequests = item.SpecialRequests
            };

            order.OrderProducts.Add(orderProduct);
            order.TotalAmount += product.Price * item.Quantity;
        }

        order.ExpectedPickUpTime = DateTime.SpecifyKind(request.ExpectedPickupTime, DateTimeKind.Utc);

        await _applicationDbContext.SaveChangesAsync();
        return BuildOrderResponse(order, products);
    }

    public async Task<OrderResponseDto> UpdateStatusAsync(Guid id, OrderStatus newStatus)
    {
        var order = await _applicationDbContext.Orders
        .Include(c => c.OrderProducts)
            .ThenInclude(op => op.Product)
        .FirstOrDefaultAsync(s => s.Id == id)
        ?? throw new KeyNotFoundException("Order is not found");

        order.OrderStatus = newStatus;
        await _applicationDbContext.SaveChangesAsync();

        return MapOrderToResponse(order);
    }
}