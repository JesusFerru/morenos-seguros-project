using MorenoSeguros.Core.Entities.PolicyAggregate;

namespace MorenoSeguros.Api.Controllers
{
    public class BankAccountResult
    {
        public Guid Id { get; set; }
        public string Bank { get; set; }
        public string AccountType { get; set; }
        public string AccountNumber { get; set; }
        public string Currency { get; set; }
        public string HolderName { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public BankAccountResult(BankAccount bankAccount)
        {
            Id = bankAccount.Id;
            Bank = bankAccount.Bank;
            AccountType = bankAccount.AccountType;
            AccountNumber = bankAccount.AccountNumber;
            Currency = bankAccount.Currency;
            HolderName = bankAccount.HolderName;
            IsActive = bankAccount.IsActive;
            CreatedAt = bankAccount.CreatedAt;
            UpdatedAt = bankAccount.UpdatedAt;
        }
    }
}
