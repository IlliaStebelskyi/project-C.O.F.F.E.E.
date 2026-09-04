namespace project_coffee.Models;

public class User : Entity
{
    public Role Role { get; set; } = Role.User;
    public UserProfile? UserProfile { get; set; }
    public ICollection<Order> Orders { get; set; } = [];

    public required string Email { get; set; }
    public required string Password { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}