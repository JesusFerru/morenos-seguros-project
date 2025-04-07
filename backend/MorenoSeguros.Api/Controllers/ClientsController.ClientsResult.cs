using MorenoSeguros.Core.Entities.ClientAggregate;

namespace MorenoSeguros.Api.Controllers;

public class ClientsResult
{
    public Guid Id { get; set; }
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
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ClientsResult(Clients client)
    {
        Id = client.Id;
        FirstName = client.FirstName;
        LastName = client.LastName;
        BirthDate = client.BirthDate;
        Nit = client.Nit;
        BusinessName = client.BusinessName;
        Email = client.Email;
        PhoneNumber = client.PhoneNumber;
        DocumentType = client.DocumentType.ToString();
        DocumentNumber = client.DocumentNumber;
        City = client.City;
        Address = client.Address;
        EmploymentStatus = client.EmploymentStatus;
        FundOrigin = client.FundOrigin;
        IncomeRange = client.IncomeRange;
        IsActive = client.IsActive;
        CreatedAt = client.CreatedAt;
        UpdatedAt = client.UpdatedAt;
    }
}