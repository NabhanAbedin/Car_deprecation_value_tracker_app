using CarDepreciationApi.data;
using CarDepreciationApi.models.dtos;
using CarDepreciationApi.models.entities;
using CarDepreciationApi.services.interfaces;
using Microsoft.EntityFrameworkCore;
using Pgvector.EntityFrameworkCore;
using Vector = Pgvector.Vector;

namespace CarDepreciationApi.services.implementations;

public class CalcluationService : ICalculationService
{
    private readonly CarDepreciationAppContext _context;

    public CalcluationService(CarDepreciationAppContext context)
    {
        _context = context;
    }

    public async Task<CalculationResponse> GetNeighbors(Vector carVector)
    {
        var rawNeighbors = await _context.MarketData
            .Where(m => m.FeaturesVector != null)
            .OrderBy(m => m.FeaturesVector!.L2Distance(carVector))
            .Take(5)
            .ToListAsync();

        var neighbors = rawNeighbors.Select(m => new
        {
            m.Id,
            m.Brand,
            m.Model,
            m.Year,
            m.SoldPrice,
            m.ConditionScore,
            m.Kilometers,
            m.FeaturesVector,
            Distance = Math.Sqrt(m.FeaturesVector!.ToArray().Zip(carVector.ToArray(), (a, b) => Math.Pow(a - b, 2)).Sum())
        }).ToList();
        
        int predictedValue;

        if (neighbors.Any(n => n.Distance == 0))
        {
            predictedValue = neighbors.First(n => n.Distance == 0).SoldPrice;
        }
        else
        {
            var weightedSum = neighbors.Sum(n => n.SoldPrice / n.Distance);
            var weightSum = neighbors.Sum(n => 1.0 / n.Distance);
            predictedValue = (int)(weightedSum / weightSum);
        }

        return new CalculationResponse
        {
            PredictedValue = predictedValue,
            Neighbors = rawNeighbors
        };

    }
}