using MorenoSeguros.Core.Entities.CompanyAggregate;
using MorenoSeguros.Core.SharedKernel;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;

public class InsurancePlan : BaseEntity, IAggregateRoot
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;

    // Navigation
    public InsuranceCompany? InsuranceCompany { get; set; }
    public List<DeductibleOption> DeductibleOptions { get; set; } = new();

    public InsurancePlan(string name, string? description = null)
    {
        Name = name;
        Description = description;
    }

    public void Update(string name, string? description)
    {
        Name = name;
        Description = description;
    }
}
