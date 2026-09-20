using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;

namespace project_coffee.Services.Interfaces;

public interface IProductService
{
    Task<ICollection<ProductResponseDto>> GetAllAsync();
    Task<ProductResponseDto> GetByIdAsync(Guid id);
    Task<ProductResponseDto> CreateProductAsync(ProductRequestDto request);
    Task<ProductResponseDto> UpdateProductAsync(Guid id, ProductRequestDto request);
    Task Delete(Guid id);
}