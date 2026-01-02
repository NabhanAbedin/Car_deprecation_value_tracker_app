using CarDepreciationApi.models.dtos;
using CarDepreciationApi.models.entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CarDepreciationApi.services.interfaces;


namespace CarDepreciationApi.controllers;

[Route("api/[controller]")]
[ApiController]
public class ValuationController : ControllerBase
{
    private readonly IValuationService _valuationService;

    public ValuationController(IValuationService valuationService)
    {
        _valuationService = valuationService;
    }

    [HttpGet("history")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Valuation>>> GetValuationHistory()
    {
        var userIdClaim = User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }
        
        var valuations = await _valuationService.GetValuationHistory(userId);
        
        return Ok(valuations);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Valuation>> GetValuation(Guid id)
    {
        var valuation = await _valuationService.GetValuation(id);

        if (valuation == null)
        {
            return NotFound();
        }
        
        return Ok(valuation);
    }

    [HttpPost("predict")]
    [Authorize]
    public async Task<IActionResult> CreatePrediction([FromBody] ValuationDto valuationDto)
    {
        
        var userIdClaim = User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }
        
        
        var valuation = await _valuationService.CreateValuation(userId, valuationDto);

        return CreatedAtAction(nameof(GetValuation), new { id = valuation.Id }, valuation);
    }
}