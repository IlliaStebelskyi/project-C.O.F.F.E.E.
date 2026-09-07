using Microsoft.EntityFrameworkCore;
using project_coffee.Data;
using project_coffee.Models;
using project_coffee.Models.DTOs.Requests;
using project_coffee.Models.DTOs.Responses;
using project_coffee.Services.Interfaces;

namespace project_coffee.Services;

public class CategoryService(ApplicationDbContext applicationDbContext) : ICategoryService
{
    private readonly ApplicationDbContext _applicationDbContext = applicationDbContext;

    public async Task<CategoryResponseDto> CreateCategoryAsync(CategoryRequestDto request)
    {
        var category = new Category
        {
            Name = request.Name,
            IsActive = request.IsActive
        };

        _applicationDbContext.Categories.Add(category);
        await _applicationDbContext.SaveChangesAsync();

        return new CategoryResponseDto(category.Id, category.Name, category.IsActive);
    }

    public async Task DeleteAsync(Guid id)
    {
        var category = await _applicationDbContext.Categories.FindAsync(id) ?? throw new KeyNotFoundException();
        _applicationDbContext.Remove(category);
        await _applicationDbContext.SaveChangesAsync();
    }

    public async Task<ICollection<CategoryResponseDto>> GetAllAsync()
    {
        return await _applicationDbContext.Categories
            .Select(c => new CategoryResponseDto(c.Id, c.Name, c.IsActive))
            .ToListAsync();
    }

    public async Task<CategoryResponseDto> GetByIdAsync(Guid id)
    {
        var category = await _applicationDbContext.Categories.FindAsync(id) ?? throw new KeyNotFoundException();
        return new CategoryResponseDto(category.Id, category.Name, category.IsActive);
    }

    public async Task<CategoryResponseDto> UpdateAsync(Guid id, CategoryRequestDto request)
    {
        var category = await _applicationDbContext.Categories.FindAsync(id)
            ?? throw new KeyNotFoundException();
        category.Name = request.Name;
        category.IsActive = request.IsActive;

        await _applicationDbContext.SaveChangesAsync();

        return new CategoryResponseDto(category.Id, category.Name, category.IsActive);
    }
}