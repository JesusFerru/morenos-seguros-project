using MorenoSeguros.Core.Entities.PolicyAggregate;
using MorenoSeguros.Core.SharedKernel;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;

public class DeductibleOption : BaseEntity, IAggregateRoot
{
    public decimal Deductible1 { get; set; } = 0m;
    public decimal Deductible2 { get; set; } = 0m;
    public string Currency { get; set; } = CurrencyConstants.Bolivians;

    // Navigation
    public Guid InsurancePlanId { get; set; }
    public InsurancePlan? InsurancePlan { get; set; }

    public ICollection<Policy> Policies { get; set; } = [];

    public DeductibleOption(decimal deductible1, decimal deductible2, string currency)
    {
        Deductible1 = deductible1;
        Deductible2 = deductible2;
        Currency = currency;
    }

    public void Update(decimal deductible1, decimal deductible2, string currency, bool isActive)
    {
        Deductible1 = deductible1;
        Deductible2 = deductible2;
        Currency = currency;
        IsActive = isActive;
    }
}
