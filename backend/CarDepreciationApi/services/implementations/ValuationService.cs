using CarDepreciationApi.data;
using CarDepreciationApi.models.dtos;
using CarDepreciationApi.models.entities;
using CarDepreciationApi.services.interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarDepreciationApi.services.implementations;

public class ValuationService : IValuationService
{
    private readonly CarDepreciationAppContext  _context;
    private readonly IKnnPredictionService _knnPredictionService;
    
    public ValuationService(CarDepreciationAppContext context, IKnnPredictionService knnPredictionService)
    {
        _context = context;
        _knnPredictionService = knnPredictionService;
    }

    public async Task<IEnumerable<Valuation>> GetValuationHistory(Guid userId)
    {
        var valuations = await _context.Valuation
            .Where(v => v.UserId == userId)
            .Include(v => v.ValuationNeighbors)
            .OrderByDescending(v => v.ValuationDate)
            .ToListAsync();
        
        return valuations;
    }

    public async Task<Valuation> GetValuation(Guid id)
    {

        var valuation = await _context.Valuation
            .Include(v => v.ValuationNeighbors)
            .ThenInclude(vn => vn.MarketData)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (valuation == null)
        {
            return null;
        }
        
        return valuation;
    }

    public async Task<Valuation> CreateValuation(Guid userId,ValuationDto valuation)
    {
        var prediction = await _knnPredictionService.GetPrediction(valuation);

        var newValuation = new Valuation
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            InputBrand = valuation.InputBrand,
            InputModel = valuation.InputModel,
            InputYear = valuation.InputYear,
            InputMileage = valuation.InputMileage,
            InputConditionScore = valuation.InputConditionScore,
            PredictedValue = prediction.PredictedValue,
            ValuationDate = DateTime.UtcNow,
        };
        
        _context.Valuation.Add(newValuation);

        var neighbors = prediction.Neighbors.Select(n => new ValuationNeighbor
        {
            Id = Guid.NewGuid(),
            ValuationId = newValuation.Id,
            MarketDataId = n.MarketDataId
        });
        
        _context.AddRange(neighbors);
        
        await _context.SaveChangesAsync();
        return newValuation;
        
    }
    
}