using MorenoSeguros.Core.Entities.ClientAggregate.ValueObjects;

namespace MorenoSeguros.Api.Controllers;

public class ClientsCommand
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateOnly? BirthDate { get; set; }
    public string? Nit { get; set; }
    public string? BusinessName { get; set; }
    public string? Email { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string DocumentNumber { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? Address { get; set; }
    public bool EmploymentStatus { get; set; }
    public string? FundOrigin { get; set; }
    public string? IncomeRange { get; set; }
    public bool IsActive { get; set; } = true;
}
