namespace MorenoSeguros.Api.Dtos;

public class DeductibleOptionCommand
{
    public decimal Deductible1 { get; set; }
    public decimal Deductible2 { get; set; }
    public string Currency { get; set; } = string.Empty;
    public Guid InsurancePlanId { get; set; }
    public bool IsActive { get; set; } = true; 
}
