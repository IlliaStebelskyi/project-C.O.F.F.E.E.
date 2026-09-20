using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using project_coffee.Models;

namespace project_coffee.Configurations;

public class CartConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.ToTable("Cart");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("CartId");

        builder.HasIndex(c => c.UserId).IsUnique();
    }
}