using MorenoSeguros.Core.SharedKernel.Constants;

namespace MorenoSeguros.Api.Controllers
{
    public class BankAccountCommand
    {
        public string Bank { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string Currency { get; set; } = CurrencyConstants.Bolivians;
        public string HolderName { get; set; } = string.Empty;

    }
}
