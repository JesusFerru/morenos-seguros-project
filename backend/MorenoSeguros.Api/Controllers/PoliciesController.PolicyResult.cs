using MorenoSeguros.Core.Entities.PolicyAggregate;

namespace MorenoSeguros.Api.Controllers
{
    public class PolicyResult
    {
        public Guid Id { get; set; }
        public string PolicyNumber { get; set; }
        public string? PreviousPolicyNumber { get; set; }
        public Guid TitularClientId { get; set; }
        public string? TitularClientName { get; set; }
        public Guid? AgentId { get; set; }
        public string? AgentName { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public Guid DeductibleOptionId { get; set; }
        public decimal? Deductible1 { get; set; }
        public string Status { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public PolicyResult(Policy policy)
        {
            Id = policy.Id;
            PolicyNumber = policy.PolicyNumber;
            PreviousPolicyNumber = policy.PreviousPolicyNumber;
            TitularClientId = policy.TitularClientId;
            TitularClientName = policy.TitularClient?.FirstName;
            AgentId = policy.AgentId;
            AgentName = policy.Agent?.FirstName;
            StartDate = policy.StartDate;
            EndDate = policy.EndDate;
            DeductibleOptionId = policy.DeductibleOptionId;
            Deductible1 = policy.DeductibleOption?.Deductible1;
            Status = policy.Status.ToString();
            IsActive = policy.IsActive;
            CreatedAt = policy.CreatedAt;
            UpdatedAt = policy.UpdatedAt;
        }
    }

}
