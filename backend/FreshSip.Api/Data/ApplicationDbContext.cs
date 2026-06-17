using FreshSip.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FreshSip.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Juice> Juices => Set<Juice>();

    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Juice>()
            .Property(juice => juice.Price)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Juice>()
            .Property(juice => juice.Name)
            .HasMaxLength(100);

        modelBuilder.Entity<Juice>()
            .Property(juice => juice.Description)
            .HasMaxLength(500);

        modelBuilder.Entity<Juice>()
            .Property(juice => juice.ImageUrl)
            .HasMaxLength(500);

        modelBuilder.Entity<Category>()
            .HasIndex(category => category.Name)
            .IsUnique();

        modelBuilder.Entity<Juice>()
            .HasOne(juice => juice.Category)
            .WithMany(category => category.Juices)
            .HasForeignKey(juice => juice.CategoryId);
    }
}
