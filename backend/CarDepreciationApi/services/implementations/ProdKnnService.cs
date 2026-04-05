using System.Text.Json;
using Amazon.Lambda;
using Amazon.Lambda.Model;
using CarDepreciationApi.data;
using CarDepreciationApi.models.dtos;
using CarDepreciationApi.services.interfaces;

namespace CarDepreciationApi.services.implementations;

public class ProdKnnService : IKnnService
{
    private readonly IAmazonLambda _lambdaclient;

    public ProdKnnService(IAmazonLambda lambdaclient)
    {
        _lambdaclient = lambdaclient;
    }
    
    public async Task<float[]?> GetVector(ValuationDto valuation)
    {
        var payload = JsonSerializer.Serialize(valuation);

        var request = new InvokeRequest
        {
            FunctionName = "vectorization_lambda",
            InvocationType = InvocationType.RequestResponse,
            Payload = payload
        };

        var response = await _lambdaclient.InvokeAsync(request);

        if (response.StatusCode == 200)
        {
            using var reader = new StreamReader(response.Payload);

            var responseJson = await reader.ReadToEndAsync();

            var outer = JsonSerializer.Deserialize<JsonElement>(responseJson);

            var body = JsonSerializer.Deserialize<JsonElement>(outer.GetProperty("body").GetString()!);
            return body.GetProperty("vector")
                .EnumerateArray()
                .Select(x => (float)x.GetDouble())
                .ToArray();
        }

        return null;

    }
}