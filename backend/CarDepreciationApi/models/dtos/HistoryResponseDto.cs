using CarDepreciationApi.models.entities;

namespace CarDepreciationApi.models.dtos;

public class HistoryResponseDto
{
    public ValuationDto Valuation { get; set; }
    public List<MarketDataDto> Neighbors { get; set; }
}