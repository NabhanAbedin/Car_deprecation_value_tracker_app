namespace CarDepreciationApi.models.entities;

public class ValuationNeighbor
{
    public Guid Id {get; set;}
    public Guid ValuationId {get; set;}
    public Guid MarketDataId {get; set;}
    
    public Valuation Valuation {get; set;}
    public MarketData MarketData {get; set;}
}