using CarDepreciationApi.models.dtos;

namespace CarDepreciationApi.services.interfaces;

public interface IKnnPredictionService
{
    Task<LambdaResponse> GetPrediction(ValuationDto valuation);
}