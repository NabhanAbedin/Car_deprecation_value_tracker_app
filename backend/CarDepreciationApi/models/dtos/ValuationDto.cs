namespace CarDepreciationApi.models.dtos;

public class ValuationDto
{
    public string InputBrand  {get; set;}
    public string InputModel  {get; set;}
    public int InputYear  {get; set;}
    public int InputConditionScore  {get; set;}
    public int InputMileage  {get; set;}
    public int PredictedValue {get; set;}
}