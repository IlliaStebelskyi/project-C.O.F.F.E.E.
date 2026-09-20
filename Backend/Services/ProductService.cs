using Microsoft.EntityFrameworkCore;
using project_coffee.Data;
using project_coffee.Models;
using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;
using project_coffee.Services.Interfaces;

namespace project_coffee.Services;

public class ProductService(ApplicationDbContext applicationDbContext) : IProductService
{
    private readonly ApplicationDbContext _applicationDbContext = applicationDbContext;

    private async Task<Category> FindCategoryAsync(Guid id)
    {
        return await _applicationDbContext.Categories.FindAsync(id)
            ?? throw new KeyNotFoundException("Category not found.");
    }

    public async Task<ProductResponseDto> CreateProductAsync(ProductRequestDto request)
    {
        var category = await FindCategoryAsync(request.CategoryId);

        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            ImageUrl = request.ImageUrl,
            IsAvailable = request.IsAvailable,
            CategoryId = request.CategoryId,
        };

        _applicationDbContext.Products.Add(product);
        await _applicationDbContext.SaveChangesAsync();

        return new ProductResponseDto(product.Id, product.Name, product.Description, product.Price, product.ImageUrl, product.IsAvailable, product.CategoryId, category.Name);
    }

    public async Task Delete(Guid id)
    {
        var product = await _applicationDbContext.Products.FindAsync(id) ?? throw new KeyNotFoundException("Product not found.");
        _applicationDbContext.Products.Remove(product);
        await _applicationDbContext.SaveChangesAsync();
    }

    public async Task<ICollection<ProductResponseDto>> GetAllAsync()
    {
        return await _applicationDbContext.Products
            .Include(p => p.Category)
            .Select(p => new ProductResponseDto(p.Id, p.Name, p.Description, p.Price, p.ImageUrl, p.IsAvailable, p.CategoryId, p.Category.Name))
            .ToListAsync();
    }

    public async Task<ProductResponseDto> GetByIdAsync(Guid id)
    {
        var product = await _applicationDbContext.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new KeyNotFoundException("Product not found.");

        return new ProductResponseDto(product.Id, product.Name, product.Description, product.Price, product.ImageUrl, product.IsAvailable, product.CategoryId, product.Category.Name);
    }

    public async Task<ProductResponseDto> UpdateProductAsync(Guid id, ProductRequestDto request)
    {
        var product = await _applicationDbContext.Products.FindAsync(id)
            ?? throw new KeyNotFoundException("Product not found.");

        var category = await FindCategoryAsync(request.CategoryId);

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.ImageUrl = request.ImageUrl;
        product.IsAvailable = request.IsAvailable;
        product.CategoryId = request.CategoryId;

        await _applicationDbContext.SaveChangesAsync();

        return new ProductResponseDto(product.Id, product.Name, product.Description, product.Price, product.ImageUrl, product.IsAvailable, product.CategoryId, category.Name);
    }
}