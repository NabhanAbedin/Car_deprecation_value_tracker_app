using Pgvector;

namespace CarDepreciationApi.models.entities;

public class MarketData
{
    public Guid Id { get; set; }
    public string Brand { get; set; }
    public string Model { get; set; }
    public int Year { get; set; }
    public int ConditionScore { get; set; }
    public int Kilometers { get; set; }
    public int SoldPrice { get; set; }
    public int Age { get; set; }
    public string Transmission { get; set; }
    public string FuelType { get; set; }
    
    public string Owner { get; set; }
    public Vector? FeaturesVector { get; set; }
    public string? Img { get; set; }
}