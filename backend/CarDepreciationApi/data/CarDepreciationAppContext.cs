namespace CarDepreciationApi.data;
using models.entities;
using Microsoft.EntityFrameworkCore;
using Pgvector.EntityFrameworkCore;


public class CarDepreciationAppContext : DbContext
{
    public CarDepreciationAppContext (DbContextOptions<CarDepreciationAppContext> options) : base(options) {}
    
    public DbSet<MarketData> MarketData {get; set;}
    public DbSet<User> User {get; set;}
    public DbSet<ValuationNeighbor>  ValuationNeighbor {get; set;}
    public DbSet<Valuation>  Valuation {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("vector");
        
        modelBuilder.Entity<User>()
            .HasMany(u => u.Valuations)
            .WithOne(v => v.User)
            .HasForeignKey(v => v.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Valuation>()
            .HasMany(v => v.ValuationNeighbors)
            .WithOne(vn => vn.Valuation)
            .HasForeignKey(vn => vn.ValuationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MarketData>(entity =>
        {
            entity.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");
            entity.Property(m => m.SoldPrice)
                .HasPrecision(18, 2);

            entity.Property(m => m.FeaturesVector)
                .HasColumnType("vector(8)");

            entity.HasIndex(m => m.FeaturesVector)
                .HasMethod("hnsw")
                .HasOperators("vector_l2_ops");
        });

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();


    }
}