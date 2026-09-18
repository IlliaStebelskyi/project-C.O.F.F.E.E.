namespace project_coffee.Models;

public class UserProfile
{
    public User? User { get; set; }

    public Guid UserId { get; set; }
    public required string Name { get; set; }
    public required string LastName { get; set; }
    public string? Phone { get; set; }
    public DateTime BirthDate { get; set; } = DateTime.UtcNow;
    public string? Preferences { get; set; }
}