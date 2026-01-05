using CarDepreciationApi.data;
using CarDepreciationApi.models.dtos;
using CarDepreciationApi.models.entities;
using CarDepreciationApi.services.interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarDepreciationApi.services.implementations;

public class MarketService : IMarketService
{
    private readonly CarDepreciationAppContext _context;
    
    public MarketService(CarDepreciationAppContext context)
    {
        _context = context;
    }

    public async Task<ICollection<MarketData>> GetMarketData(MarketDataDto marketSearch)
    {
       var marketQuery = _context.MarketData.AsQueryable();

       if (!string.IsNullOrEmpty(marketSearch.Brand))
       {
           marketQuery = marketQuery.Where(x => x.Brand == marketSearch.Brand);
       }

       if (!string.IsNullOrEmpty(marketSearch.Model))
       {
           marketQuery = marketQuery.Where(x => x.Model == marketSearch.Model);
       }

       if (marketSearch.Year.HasValue)
       {
           marketQuery = marketQuery.Where(x => x.Year == marketSearch.Year);
       }

       if (marketSearch.ConditionScore.HasValue)
       {
           marketQuery = marketQuery.Where(x => x.ConditionScore == marketSearch.ConditionScore);
       }

       if (marketSearch.Mileage.HasValue)
       {
           var mileageMin = Math.Max(marketSearch.Mileage.Value - 3000, 0);
           var mileageMax = marketSearch.Mileage.Value + 3000;
           
           marketQuery = marketQuery.Where(x => x.Mileage <= mileageMax &&  x.Mileage >= mileageMin);
       }

       if (marketSearch.SoldPrice.HasValue)
       {
           var soldPriceMin = Math.Max(marketSearch.SoldPrice.Value - 3000, 0);
           var soldPriceMax = marketSearch.SoldPrice.Value + 3000;
           
           marketQuery = marketQuery.Where(x => x.SoldPrice <= soldPriceMax && x.SoldPrice >= soldPriceMin);
       }

       return await marketQuery.ToListAsync();
    }

    public async Task<MarketData> GetMarketDataWithId(Guid id)
    {
       var marketData = await _context.MarketData.FirstOrDefaultAsync(x => x.Id == id);
       return marketData;
    }
}