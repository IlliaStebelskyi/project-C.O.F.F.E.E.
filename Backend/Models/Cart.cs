namespace project_coffee.Models;

public class Cart : Entity
{
    public Guid UserId { get; set; }
    public ICollection<CartItem> CartItems { get; set; } = [];
}