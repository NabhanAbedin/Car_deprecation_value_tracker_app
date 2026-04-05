using System.Diagnostics;
using System.Text.Json;
using CarDepreciationApi.models.dtos;
using CarDepreciationApi.services.interfaces;

namespace CarDepreciationApi.services.implementations;

public class DevKnnService : IKnnService
{
    public async Task<float[]?> GetVector(ValuationDto valuation)
    {
        var payload = JsonSerializer.Serialize(valuation);

        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = "python3",
                Arguments = "/Users/nabhanabedin/Desktop/Car_deprecation_value_tracker_app/infrastructure/local/vectorization_local.py",
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                UseShellExecute = false

            }
        };

        process.Start();

        await process.StandardInput.WriteAsync(payload);
        process.StandardInput.Close();

        var output = await process.StandardOutput.ReadToEndAsync();

        var result = JsonSerializer.Deserialize<JsonElement>(output);
        return result.GetProperty("vector")
            .EnumerateArray()
            .Select(x => (float)x.GetDouble())
            .ToArray();
    }

}