using CarDepreciationApi.models.dtos;
using Vector = Pgvector.Vector;

namespace CarDepreciationApi.services.interfaces;

public interface ICalculationService
{
    public Task<CalculationResponse> GetNeighbors(Vector carVector);
}