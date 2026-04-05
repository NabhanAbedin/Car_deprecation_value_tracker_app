namespace CarDepreciationApi.models.dtos;

public class MarketDataDto
{
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public int? ConditionScore {get; set;}
    public int? Kilometers {get; set;}
    public int? SoldPrice {get; set;}
}