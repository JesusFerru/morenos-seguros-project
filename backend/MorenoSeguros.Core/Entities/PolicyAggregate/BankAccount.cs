using MorenoSeguros.Core.SharedKernel;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.Entities.PolicyAggregate;
public class BankAccount : BaseEntity, IAggregateRoot
{
    public string Bank { get; set; } = string.Empty;
    public string AccountType { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string Currency { get; set; } = CurrencyConstants.Bolivians;
    public string HolderName { get; set; } = string.Empty;
}
