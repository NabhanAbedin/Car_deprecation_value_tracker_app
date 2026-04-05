using CarDepreciationApi.models.entities;

namespace CarDepreciationApi.models.dtos;

public class ValuationResponseDto
{
    public Guid ValuationId { get; set; }
    public CalculationResponse CalcluatedNeigbors { get; set; }
    // public Valuation NewValuation { get; set; }
}