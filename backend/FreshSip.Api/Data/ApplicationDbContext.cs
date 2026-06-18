using FreshSip.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FreshSip.Api.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Juice> Juices => Set<Juice>();

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<Order> Orders => Set<Order>();

    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

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

        modelBuilder.Entity<Order>()
            .Property(order => order.CustomerName)
            .HasMaxLength(100);

        modelBuilder.Entity<Order>()
            .Property(order => order.CustomerPhone)
            .HasMaxLength(20);

        modelBuilder.Entity<Order>()
            .Property(order => order.Status)
            .HasMaxLength(50);

        modelBuilder.Entity<Order>()
            .Property(order => order.TotalAmount)
            .HasPrecision(10, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(orderItem => orderItem.UnitPrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(orderItem => orderItem.Subtotal)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Order>()
            .HasMany(order => order.OrderItems)
            .WithOne(orderItem => orderItem.Order)
            .HasForeignKey(orderItem => orderItem.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .HasOne(orderItem => orderItem.Juice)
            .WithMany(juice => juice.OrderItems)
            .HasForeignKey(orderItem => orderItem.JuiceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
