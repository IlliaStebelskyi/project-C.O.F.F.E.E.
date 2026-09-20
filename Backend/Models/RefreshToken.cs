using project_coffee.Models;

public class RefreshToken
{
    public Guid Id { get; set; }
    required public string Token { get; set; }
    public Guid UserId { get; set; }
    public DateTime ExpireOnUtc { get; set; }
    public bool IsRevoked { get; set; }
    public User? User { get; set; }
}