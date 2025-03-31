using MorenoSeguros.Core.Entities.ClientAggregate;
using MorenoSeguros.Core.SharedKernel;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.Entities.PolicyAggregate;
public class PolicyMember : BaseEntity, IAggregateRoot
{
    public bool IsTitular { get; set; }
    public DateOnly? EntryDate { get; set; }
    public string? Status { get; set; }
    public string? Exclusions { get; set; }
    public string? MemberType { get; set; }

    // Navigation
    public Clients? Client { get; set; }
    public Policy? Policy { get; set; }
}
