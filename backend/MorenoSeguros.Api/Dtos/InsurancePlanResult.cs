using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;

namespace MorenoSeguros.Api.Dtos;

public class InsurancePlanResult
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public Guid? InsuranceCompanyId { get; set; }
    public string? InsuranceCompanyName { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public InsurancePlanResult(InsurancePlan plan)
    {
        Id = plan.Id;
        Name = plan.Name;
        Description = plan.Description;
        InsuranceCompanyId = plan.InsuranceCompanyId;
        InsuranceCompanyName = plan.InsuranceCompany?.Name;
        IsActive = plan.IsActive;
        CreatedAt = plan.CreatedAt;
        UpdatedAt = plan.UpdatedAt;
    }
}
