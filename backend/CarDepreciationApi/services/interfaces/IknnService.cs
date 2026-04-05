using CarDepreciationApi.models.dtos;

namespace CarDepreciationApi.services.interfaces;

public interface IKnnService
{
    Task<float[]?> GetVector(ValuationDto valuation);
}