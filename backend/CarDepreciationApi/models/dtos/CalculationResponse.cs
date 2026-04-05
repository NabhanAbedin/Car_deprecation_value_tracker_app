using CarDepreciationApi.models.entities;

namespace CarDepreciationApi.models.dtos;

public class CalculationResponse
{
    public int PredictedValue { get; set; }
    public List<MarketData> Neighbors { get; set; }
}