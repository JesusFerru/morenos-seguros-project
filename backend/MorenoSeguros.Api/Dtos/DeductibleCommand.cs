namespace MorenoSeguros.Api.Dtos;

public class DeductibleOptionCommand
{
    public decimal DeductibleIndividual { get; set; }
    public decimal DeductibleFamily { get; set; }
    public string Currency { get; set; } = string.Empty;
    public Guid InsurancePlanId { get; set; }
    public bool IsActive { get; set; } = true; 
}
