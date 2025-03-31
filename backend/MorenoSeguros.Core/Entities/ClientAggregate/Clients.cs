using MorenoSeguros.Core.Entities.ClientAggregate.ValueObjects;
using MorenoSeguros.Core.Entities.PolicyAggregate;
using MorenoSeguros.Core.SharedKernel;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.Entities.ClientAggregate;

public class Clients : BaseEntity, IAggregateRoot
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public DateOnly? BirthDate { get; set; }
    public string? Nit { get; set; }    // Just for Invoicing
    public string? BusinessName { get; set; } // Just for Invoicing
    public string? Email { get; set; }
    public required string PhoneNumber { get; set; }
    public DocumentType DocumentType { get; set; } = DocumentType.Ci;
    public required string DocumentNumber { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    public bool EmploymentStatus { get; set; }
    public string? FundOrigin { get; set; }
    public string? IncomeRange { get; set; }

    // Navigation
    public List<PolicyMember> PolicyMemberships { get; set; } = new();
}
