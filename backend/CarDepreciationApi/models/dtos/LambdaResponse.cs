namespace CarDepreciationApi.models.dtos;

public class LambdaResponse
{
    public int PredictedValue { get; set; }
    public List<NeighborDto> Neighbors { get; set; }
}