using MorenoSeguros.Core.Entities.ClientAggregate;
using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;
using MorenoSeguros.Core.Entities.PolicyAggregate.ValueObjects;
using MorenoSeguros.Core.Entities.UserAggregate;
using MorenoSeguros.Core.SharedKernel;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.Entities.PolicyAggregate;

public class Policy : BaseEntity, IAggregateRoot
{
    public string PolicyNumber { get; set; } = string.Empty;
    public string? PreviousPolicyNumber { get; set; }
    public Guid TitularClientId { get; set; }
    public Guid? AgentId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public Guid DeductibleOptionId { get; set; }
    public PolicyStatus Status { get; set; } = PolicyStatus.Draft;
    public DeductibleOption? DeductibleOption { get; set; }
    public Clients? TitularClient { get; set; }
    public User? Agent { get; set; }
    public BankAccount? BankAccount { get; set; }

    // Navigation
    public ICollection<PolicyMember> PolicyMembers { get; set; } = new List<PolicyMember>();
    public ICollection<Payments> Payments { get; set; } = new List<Payments>();
}
