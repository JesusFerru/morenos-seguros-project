namespace MorenoSeguros.Api.Controllers
{
    public class PaymentsCommand
    {
        public string PolicyNumber { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; }
        public string Period { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string? ReceiptUrl { get; set; }
    }
}
