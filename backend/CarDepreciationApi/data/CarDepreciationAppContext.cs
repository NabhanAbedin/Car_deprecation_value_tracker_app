namespace CarDepreciationApi.data;
using models.entities;
using Microsoft.EntityFrameworkCore;


public class CarDepreciationAppContext : DbContext
{
    public CarDepreciationAppContext (DbContextOptions<CarDepreciationAppContext> options) : base(options) {}
    
    public DbSet<MarketData> MarketData {get; set;}
    public DbSet<User> User {get; set;}
    public DbSet<ValuationNeighbor>  ValuationNeighbor {get; set;}
    public DbSet<Valuation>  Valuation {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasMany(u => u.Valuations)
            .WithOne(v => v.User)
            .HasForeignKey(v => v.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Valuation>()
            .HasMany(v => v.ValuationNeighbors)
            .WithOne(vn => vn.Valuation)
            .HasForeignKey(vn => vn.ValuationId);

        modelBuilder.Entity<MarketData>()
            .Property(m => m.SoldPrice)
            .HasPrecision(18, 2);
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();


    }
}