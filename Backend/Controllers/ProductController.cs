using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using project_coffee.Helpers;
using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;
using project_coffee.Services.Interfaces;

namespace project_coffee.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ProductController(IProductService productService) : ControllerBase
{
    private readonly IProductService _productService = productService;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetProducts()
    {
        var product = await _productService.GetAllAsync();
        return Ok(new ApiResponse<ICollection<ProductResponseDto>> { Success = true, Data = product });
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProductById(Guid id)
    {
        try
        {
            var product = await _productService.GetByIdAsync(id);
            return Ok(new ApiResponse<ProductResponseDto> { Success = true, Data = product });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Product not found." });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProduct([FromBody] ProductRequestDto request)
    {
        try
        {
            var product = await _productService.CreateProductAsync(request);
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Category not found." });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(Guid id, ProductRequestDto request)
    {
        try
        {
            var product = await _productService.UpdateProductAsync(id, request);
            return Ok(new ApiResponse<ProductResponseDto> { Success = true, Data = product });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Product not found." });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]

    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _productService.Delete(id);
            return Ok(new ApiResponse<object> { Success = true, Message = "Deleted." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Product not found." });
        }
    }
}