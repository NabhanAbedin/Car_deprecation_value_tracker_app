using Pgvector;

namespace CarDepreciationApi.models.entities;

public class Valuation
{
    public Guid Id {get; set;}
    public Guid UserId {get; set;}
    public string InputBrand  {get; set;}
    public string InputModel  {get; set;}
    public int InputYear  {get; set;}
    public int InputConditionScore  {get; set;}
    public int InputKilometers  {get; set;}
    public string InputFuelType { get; set; }
    public string InputTransmission { get; set; }
    public int PredictedValue { get; set; }
    public DateTime ValuationDate {get; set;} =  DateTime.UtcNow;
    public Vector FeaturesVector { get; set; }
    
    public User User {get; set;}
    public ICollection<ValuationNeighbor> ValuationNeighbors {get; set;}
}