namespace CarDepreciationApi.models.entities;

public class MarketData
{
    public Guid Id { get; set; }
    public string Brand { get; set; }
    public string Model { get; set; }
    public int Year { get; set; }
    public int ConditionScore {get; set;}
    public int Mileage {get; set;}
    public int SoldPrice {get; set;}
    public DateTime SoldDate {get; set;}
}