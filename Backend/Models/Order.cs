namespace project_coffee.Models;

public class Order : Entity
{
    public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
    public ICollection<OrderProduct> OrderProducts { get; set; } = []; // было OrderProduct? OrderProduct

    public Guid? UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime ExpectedPickUpTime { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}