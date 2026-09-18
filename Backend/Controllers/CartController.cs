using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using project_coffee.Exceptions;
using project_coffee.Helpers;
using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;
using project_coffee.Services.Interfaces;

namespace project_coffee.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController(ICartService cartService) : ControllerBase
{
    private readonly ICartService _cartService = cartService;

    private Guid CurrentUserId =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User id claim missing."));

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var cart = await _cartService.GetCartAsync(CurrentUserId);
        return Ok(new ApiResponse<CartResponseDto> { Success = true, Data = cart });
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddItem([FromBody] AddCartItemRequestDto request)
    {
        try
        {
            var cart = await _cartService.AddItemAsync(CurrentUserId, request);
            return Ok(new ApiResponse<CartResponseDto> { Success = true, Data = cart });
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

    [HttpPut("items/{productId}")]
    public async Task<IActionResult> UpdateItem(Guid productId, [FromBody] UpdateCartItemRequestDto request)
    {
        try
        {
            var cart = await _cartService.UpdateItemAsync(CurrentUserId, productId, request);
            return Ok(new ApiResponse<CartResponseDto> { Success = true, Data = cart });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpDelete("items/{productId}")]
    public async Task<IActionResult> RemoveItem(Guid productId)
    {
        var cart = await _cartService.RemoveItemAsync(CurrentUserId, productId);
        return Ok(new ApiResponse<CartResponseDto> { Success = true, Data = cart });
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        await _cartService.ClearCartAsync(CurrentUserId);
        return Ok(new ApiResponse<object> { Success = true, Message = "Cart cleared." });
    }
}
