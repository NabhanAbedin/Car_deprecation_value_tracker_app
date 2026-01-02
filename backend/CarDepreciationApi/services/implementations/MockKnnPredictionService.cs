using CarDepreciationApi.models.dtos;
using CarDepreciationApi.services.interfaces;

namespace CarDepreciationApi.services.implementations;

public class MockKnnPredictionService : IKnnPredictionService
{
    public async Task<LambdaResponse> GetPrediction(ValuationDto valuation)
    {
        await Task.Delay(100);

        return new LambdaResponse
        {
            PredictedValue = valuation.PredictedValue,
            Neighbors = new List<NeighborDto>
            {
                new NeighborDto { MarketDataId = Guid.NewGuid() },
                new NeighborDto { MarketDataId = Guid.NewGuid() },
                new NeighborDto { MarketDataId = Guid.NewGuid() }
            }
        };
    }
}