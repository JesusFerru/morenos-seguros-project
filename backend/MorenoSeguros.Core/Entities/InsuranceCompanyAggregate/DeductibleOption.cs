using MorenoSeguros.Core.SharedKernel;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;

public class DeductibleOption : BaseEntity, IAggregateRoot
{
    public decimal DeductibleIndividual { get; set; } = 0m;
    public decimal DeductibleFamily { get; set; } = 0m;
    public string Currency { get; set; } = CurrencyConstants.Bolivians;

    // Navigation
    public InsurancePlan? InsurancePlan { get; private set; }

    public DeductibleOption(decimal deductibleIndividual, decimal deductibleFamily, string currency)
    {
        DeductibleIndividual = deductibleIndividual;
        DeductibleFamily = deductibleFamily;
        Currency = currency;
    }

    public void Update(decimal deductibleIndividual, decimal deductibleFamily, string currency)
    {
        DeductibleIndividual = deductibleIndividual;
        DeductibleFamily = deductibleFamily;
        Currency = currency;
    }
}
