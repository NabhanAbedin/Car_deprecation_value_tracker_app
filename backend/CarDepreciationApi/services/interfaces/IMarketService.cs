using CarDepreciationApi.models.dtos;
using CarDepreciationApi.models.entities;

namespace CarDepreciationApi.services.interfaces;

public interface IMarketService
{
    public Task<ICollection<MarketData>> GetMarketData(MarketDataDto marketSearch);
    public Task<MarketData> GetMarketDataWithId(Guid id);
}