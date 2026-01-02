using CarDepreciationApi.models.dtos;
using CarDepreciationApi.models.entities;

namespace CarDepreciationApi.services.interfaces;

public interface IValuationService
{
    Task<IEnumerable<Valuation>> GetValuationHistory(Guid userId);
    Task<Valuation> GetValuation(Guid id);
    Task<Valuation> CreateValuation(Guid userId, ValuationDto valuation);
}