using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;

namespace project_coffee.Services.Interfaces;


public interface ICategoryService
{
    Task<ICollection<CategoryResponseDto>> GetAllAsync();
    Task<CategoryResponseDto> GetByIdAsync(Guid id);
    Task<CategoryResponseDto> CreateCategoryAsync(CategoryRequestDto request);
    Task<CategoryResponseDto> UpdateAsync(Guid id, CategoryRequestDto request);
    Task DeleteAsync(Guid id);
}