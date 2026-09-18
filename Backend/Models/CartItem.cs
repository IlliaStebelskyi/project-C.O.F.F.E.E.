namespace project_coffee.Models;

public class CartItem
{
    public Cart? Cart { get; set; }
    public Product? Product { get; set; }

    public Guid CartId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public string? SpecialRequests { get; set; }
}
