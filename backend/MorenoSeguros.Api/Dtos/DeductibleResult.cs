using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;

namespace MorenoSeguros.Api.Dtos
{
    public class DeductibleOptionResult
    {
        public Guid Id { get; set; }
        public decimal DeductibleIndividual { get; set; }
        public decimal DeductibleFamily { get; set; }
        public string Currency { get; set; } = string.Empty;
        public Guid InsurancePlanId { get; set; }
        public string InsurancePlanName { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public DeductibleOptionResult(DeductibleOption option)
        {
            Id = option.Id;
            DeductibleIndividual = option.DeductibleIndividual;
            DeductibleFamily = option.DeductibleFamily;
            Currency = option.Currency;
            InsurancePlanId = option.InsurancePlanId;
            InsurancePlanName = option.InsurancePlan?.Name ?? string.Empty;
            IsActive = option.IsActive;
            CreatedAt = option.CreatedAt;
            UpdatedAt = option.UpdatedAt;
        }
    }
}
