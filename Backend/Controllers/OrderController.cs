using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using project_coffee.Exceptions;
using project_coffee.Helpers;
using project_coffee.Models;
using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;
using project_coffee.Services.Interfaces;

namespace project_coffee.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]

public class OrderController(IOrderService orderService) : ControllerBase
{
    private readonly IOrderService _orderService = orderService;

    private Guid CurrentUserId =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User id claim missing."));

    private bool IsAdmin => User.IsInRole("Admin");

    [HttpPost]
    public async Task<IActionResult> CreateOrder(Guid userId, [FromBody] CreateOrderRequestDto request)
    {
        try
        {
            var order = await _orderService.CreateOrderAsync(CurrentUserId, request);
            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id },
                new ApiResponse<OrderResponseDto> { Success = true, Data = order });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (ProductUnvailableException ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        try
        {
            var order = await _orderService.GetByIdAsync(id);
            return Ok(new ApiResponse<OrderResponseDto> { Success = true, Data = order });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Order not found." });
        }
    }

    [HttpGet("my")]
    public async Task<IActionResult> MyOrders()
    {
        var user = await _orderService.GetUserOrderAsync(CurrentUserId);
        return Ok(new ApiResponse<ICollection<OrderResponseDto>> { Success = true, Data = user });
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetOrdersAdmin()
    {
        var admin = await _orderService.GetAllOrdersAsync();
        return Ok(new ApiResponse<ICollection<OrderResponseDto>> { Success = true, Data = admin });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOrder(Guid id, [FromBody] CreateOrderRequestDto request)
    {
        try
        {
            var order = await _orderService.UpdateOrderAsync(id, CurrentUserId, request);
            return Ok(new ApiResponse<OrderResponseDto> { Success = true, Data = order });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (ProductUnvailableException ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(Guid id, OrderStatus orderStatus)
    {
        try
        {
            var order = await _orderService.UpdateStatusAsync(id, orderStatus);
            return Ok(new ApiResponse<OrderResponseDto> { Success = true, Data = order });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(Guid id)
    {
        try
        {
            var order = await _orderService.GetByIdAsync(id); 
            if (!IsAdmin && order.UserId != CurrentUserId)
                return Forbid();

            await _orderService.DeleteOrder(id);
            return Ok(new ApiResponse<object> { Success = true, Message = "Deleted." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Order not found." });
        }
    }
}
