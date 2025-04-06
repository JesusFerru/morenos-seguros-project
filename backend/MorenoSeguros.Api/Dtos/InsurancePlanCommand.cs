namespace MorenoSeguros.Api.Dtos;

public class InsurancePlanCommand
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid InsuranceCompanyId { get; set; }
    public bool IsActive { get; set; } = true; // just in update
}
