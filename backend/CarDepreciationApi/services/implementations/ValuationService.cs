using CarDepreciationApi.data;
using CarDepreciationApi.models.dtos;
using CarDepreciationApi.models.entities;
using CarDepreciationApi.services.interfaces;
using Microsoft.EntityFrameworkCore;
using Pgvector;

namespace CarDepreciationApi.services.implementations;

public class ValuationService : IValuationService
{
    private readonly CarDepreciationAppContext  _context;
    private readonly IKnnService _knnService;
    private readonly ICalculationService _calculationService;
    
    public ValuationService(CarDepreciationAppContext context, IKnnService knnService, ICalculationService calculationService)
    {
        _context = context;
        _knnService = knnService;
        _calculationService = calculationService;
    }

    public async Task<IEnumerable<Valuation>> GetValuationHistory(Guid userId)
    {
        var valuations = await _context.Valuation
            .Where(v => v.UserId == userId)
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

    public async Task<ValuationResponseDto> CreateValuation(Guid userId,ValuationDto valuation)
    {

        var floatArray = await _knnService.GetVector(valuation);

        var vector = new Vector(floatArray);

        var calculation = await _calculationService.GetNeighbors(vector);

        var newValuation = new Valuation
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            InputBrand = valuation.InputBrand,
            InputModel = valuation.InputModel,
            InputYear = valuation.InputYear,
            InputKilometers = valuation.InputKilometers,
            InputConditionScore = valuation.InputConditionScore,
            InputTransmission = valuation.InputTransmission,
            InputFuelType = valuation.InputFuelType,
            PredictedValue = calculation.PredictedValue,
            ValuationDate = DateTime.UtcNow,
            FeaturesVector = vector
        };
        
        _context.Valuation.Add(newValuation);

        var neighbors = calculation.Neighbors.Select(c => new ValuationNeighbor
        {
            ValuationId = newValuation.Id,
            MarketDataId = c.Id
        }).ToList();

        _context.ValuationNeighbor.AddRange(neighbors);
        
        await _context.SaveChangesAsync();
        return new ValuationResponseDto
        {
            ValuationId = newValuation.Id,
            CalcluatedNeigbors = calculation,
        };
        
    }

    public async Task<HistoryResponseDto> GetValHistoryById(Guid userId, Guid valuationId)
    {
        var valuation = await _context.Valuation
            .Include(v => v.ValuationNeighbors)
            .ThenInclude(vn => vn.MarketData)
            .FirstOrDefaultAsync(v => v.Id == valuationId && v.UserId == userId);

        return new HistoryResponseDto
        {
            Valuation = new ValuationDto
            {
                InputBrand = valuation.InputBrand,
                InputModel = valuation.InputModel,
                InputYear = valuation.InputYear,
                InputConditionScore = valuation.InputConditionScore,
                InputKilometers = valuation.InputKilometers,
                InputTransmission = valuation.InputTransmission,
                InputFuelType = valuation.InputFuelType,
                PredictedValue = valuation.PredictedValue
            },
            Neighbors = valuation.ValuationNeighbors.Select(vn => new MarketDataDto
            {
                Brand = vn.MarketData.Brand,
                Model = vn.MarketData.Model,
                Year = vn.MarketData.Year,
                ConditionScore = vn.MarketData.ConditionScore,
                Kilometers = vn.MarketData.Kilometers,
                SoldPrice = vn.MarketData.SoldPrice,
            }).ToList()
        };

    }
}