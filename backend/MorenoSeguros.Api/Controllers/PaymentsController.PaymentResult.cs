using MorenoSeguros.Core.Entities.PolicyAggregate;

namespace MorenoSeguros.Api.Controllers
{
    public class PaymentsResult
    {
        public Guid Id { get; set; }
        public string PolicyNumber { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Period { get; set; }
        public string PaymentMethod { get; set; }
        public decimal Amount { get; set; }
        public string? ReceiptUrl { get; set; }

        public PaymentsResult(Payments payment)
        {
            Id = payment.Id;
            PolicyNumber = payment.PolicyNumber;
            PaymentDate = payment.PaymentDate;
            Period = payment.Period;
            PaymentMethod = payment.PaymentMethod;
            Amount = payment.Amount;
            ReceiptUrl = payment.ReceiptUrl;
        }
    }
}
