using MorenoSeguros.Core.SharedKernel;

namespace MorenoSeguros.Core.Entities.PolicyAggregate;
public class Payments : BaseEntity
{
    public string PolicyNumber { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
    public string Period { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? ReceiptUrl { get; set; }

    // Navigation
    public Policy? Policy { get; set; }
}
