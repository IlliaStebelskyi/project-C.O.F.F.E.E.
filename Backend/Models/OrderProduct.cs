namespace project_coffee.Models;

public class OrderProduct
{
    public Order? Order { get; set; }
    public Product? Product { get; set; }

    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal CurrentPrice { get; set; }
    public string? SpecialRequests { get; set; }
}