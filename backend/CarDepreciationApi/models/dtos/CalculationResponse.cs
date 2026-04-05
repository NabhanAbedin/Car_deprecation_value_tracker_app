namespace CarDepreciationApi.models.dtos;

public class CaluclationResponse
{
    public int PredictedValue { get; set; }
    public List<MarketDataDto> Neighbors { get; set; }
}