namespace CarDepreciationApi.models.entities;

public class Valuation
{
    public Guid Id {get; set;}
    public Guid UserId {get; set;}
    public string InputBrand  {get; set;}
    public string InputModel  {get; set;}
    public int InputYear  {get; set;}
    public int InputConditionScore  {get; set;}
    public int InputMileage  {get; set;}
    public int PredictedValue {get; set;}
    public DateTime ValuationDate {get; set;} =  DateTime.UtcNow;
    
    public User User {get; set;}
    public ICollection<ValuationNeighbor> ValuationNeighbors {get; set;}
}