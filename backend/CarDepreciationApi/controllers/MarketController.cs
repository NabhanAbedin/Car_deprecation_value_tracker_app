using CarDepreciationApi.models.dtos;
using CarDepreciationApi.models.entities;
using CarDepreciationApi.services.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Amazon.Lambda;
using Amazon.Lambda.Model;
using System.Text.Json;

namespace CarDepreciationApi.controllers;

[Route("api/[controller]")]
[ApiController]
public class MarketController : ControllerBase
{
    private readonly IMarketService _marketService;
    private readonly IAmazonLambda _lambdaClient;
    

    public MarketController(IMarketService marketService, IAmazonLambda lambdaClient)
    {
        _marketService = marketService;
        _lambdaClient = lambdaClient;

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

    [Authorize(Roles = "Admin")]
    [HttpPost("upload-data")]
    public async Task<IActionResult> UploadMarketData(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Please upload CSV file");
        }
        
        if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Only .csv files are supported.");
        }

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            string csvContent = await reader.ReadToEndAsync();

            var payload = new { csv_data = csvContent };
            var jsonPayload = JsonSerializer.Serialize(payload);

            var request = new InvokeRequest
            {
                FunctionName = "data_cleaner_lambda",
                InvocationType = InvocationType.RequestResponse,
                Payload = jsonPayload
            };

            var response = await _lambdaClient.InvokeAsync(request);

            if (response.StatusCode == 200)
            {
                return Ok(new { message = "Data proccessed successfully" });
            }
        
            return StatusCode((int)response.StatusCode, "Lambda processing failed.");
        }
        catch (Exception e)
        {   
            throw;
        }

    }
}