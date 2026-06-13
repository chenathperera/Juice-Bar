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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Juice>()
            .Property(juice => juice.Price)
            .HasPrecision(10, 2);
    }
}
