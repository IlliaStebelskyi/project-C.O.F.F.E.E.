using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using project_coffee.Models;

namespace project_coffee.Configurations;

public class OrderProductConfiguration : IEntityTypeConfiguration<OrderProduct>
{
    public void Configure(EntityTypeBuilder<OrderProduct> builder)
    {
        builder.ToTable("OrderProduct");
        builder.HasKey(op => new { op.OrderId, op.ProductId });

        builder.HasOne(op => op.Order)
            .WithMany(o => o.OrderProducts)
            .HasForeignKey(op => op.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(op => op.Product)
            .WithMany()
            .HasForeignKey(op => op.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}