namespace MorenoSeguros.Api.Dtos;

public class StoreInsurancePlanCommand
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid InsuranceCompanyId { get; set; }
}
