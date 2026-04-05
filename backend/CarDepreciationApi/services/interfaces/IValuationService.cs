using CarDepreciationApi.models.dtos;
using CarDepreciationApi.models.entities;

namespace CarDepreciationApi.services.interfaces;

public interface IValuationService
{
    Task<IEnumerable<Valuation>> GetValuationHistory(Guid userId);
    Task<Valuation> GetValuation(Guid id);
    Task<ValuationResponseDto> CreateValuation(Guid userId, ValuationDto valuation);
    Task<HistoryResponseDto> GetValHistoryById(Guid userId, Guid valuationId);
}