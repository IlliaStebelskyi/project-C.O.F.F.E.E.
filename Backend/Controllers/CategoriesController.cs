using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using project_coffee.Helpers;
using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;
using project_coffee.Services.Interfaces;

namespace project_coffee.Controllers;

[ApiController]
[Route("api/[controller]")]

public class CategoryController(ICategoryService categoryService) : ControllerBase
{
    private readonly ICategoryService _categoryService = categoryService;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllCategories()
    {
        var category = await _categoryService.GetAllAsync();
        return Ok(new ApiResponse<ICollection<CategoryResponseDto>> { Success = true, Data = category });
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCategoryById(Guid id)
    {
        try
        {
            var category = await _categoryService.GetByIdAsync(id);
            return Ok(new ApiResponse<CategoryResponseDto> { Success = true, Data = category });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Category not found." });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> PostCategory([FromBody] CategoryRequestDto request)
    {
        var category = await _categoryService.CreateCategoryAsync(request);
        return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CategoryRequestDto request)
    {
        try
        {
            var category = await _categoryService.UpdateAsync(id, request);
            return Ok(new ApiResponse<CategoryResponseDto> { Success = true, Data = category });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Category not found." });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _categoryService.DeleteAsync(id);
            return Ok(new ApiResponse<object> { Success = true, Message = "Category deleted successfully." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Category not found." });
        }
    }
}
