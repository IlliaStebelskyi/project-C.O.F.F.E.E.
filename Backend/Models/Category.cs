namespace project_coffee.Models;

public class Category : Entity
{
    public required string Name { get; set; }
    public bool IsActive { get; set; }
    public ICollection<Product> Products { get; set; } = [];
}