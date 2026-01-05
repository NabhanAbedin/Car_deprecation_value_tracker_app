using CarDepreciationApi.models.dtos;
using CarDepreciationApi.models.entities;
using CarDepreciationApi.services.interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarDepreciationApi.controllers;

[Route("api/[controller]")]
[ApiController]
public class MarketController : ControllerBase
{
    private readonly IMarketService _marketService;

    public MarketController(IMarketService marketService)
    {
        _marketService = marketService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MarketData>>> GetMarketData([FromQuery] MarketDataDto marketSearch) 
    {
       var marketData = await _marketService.GetMarketData(marketSearch);
       return Ok(marketData);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<MarketData>> GetMarketData(Guid id)
    {
        var marketData = await _marketService.GetMarketDataWithId(id);
        return Ok(marketData);
    }
}