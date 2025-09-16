using MorenoSeguros.Core.Entities.PolicyAggregate.ValueObjects;

namespace MorenoSeguros.Api.Controllers
{
    public class PolicyCommand
    {
        public string PolicyNumber { get; set; } = string.Empty;
        public string? PreviousPolicyNumber { get; set; }
        public Guid TitularClientId { get; set; }
        public Guid? AgentId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public Guid DeductibleOptionId { get; set; }
        public PolicyStatus Status { get; set; } = PolicyStatus.Draft;
        public bool IsActive { get; set; }
    }
}
