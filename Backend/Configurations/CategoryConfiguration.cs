using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using project_coffee.Models;

namespace project_coffee.Configurations;

public class CategoryConfigurations : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Category");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("CategoryId");

        builder.HasMany(c => c.Products)
            .WithOne(p => p.Category)
            .HasForeignKey(o => o.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}