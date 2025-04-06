using MorenoSeguros.Core.Entities.CompanyAggregate;
using MorenoSeguros.Core.SharedKernel;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;

public class InsurancePlan : BaseEntity, IAggregateRoot
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;

    // Navigation
    public Guid InsuranceCompanyId { get; set; }
    public InsuranceCompany? InsuranceCompany { get; set; }
    public List<DeductibleOption> DeductibleOptions { get; set; } = new();

    public InsurancePlan(string name, string? description = null)
    {
        Name = name;
        Description = description;
    }

    public void UpdateInfo(string name, string? description, bool isActive)
    {
        Name = name;
        Description = description;
        IsActive = isActive;
    }
}
