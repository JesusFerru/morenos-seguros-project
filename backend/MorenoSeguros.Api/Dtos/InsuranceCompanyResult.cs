using MorenoSeguros.Core.Entities.CompanyAggregate;

namespace MorenoSeguros.Api.Dtos;

public class InsuranceCompanyResult
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public bool? IsActive { get; set; } = true;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }


    public InsuranceCompanyResult(Guid id, string name, string? description, string? logoUrl, string? websiteUrl, bool? isActive)
    {
        Id = id;
        Name = name;
        Description = description;
        LogoUrl = logoUrl;
        WebsiteUrl = websiteUrl;
        IsActive = isActive;
    }

    public InsuranceCompanyResult(InsuranceCompany company)
    {
        Id = company.Id;
        Name = company.Name;
        Description = company.Description;
        LogoUrl = company.LogoUrl;
        WebsiteUrl = company.WebsiteUrl;
        IsActive = company.IsActive;
        CreatedAt = company.CreatedAt;
        UpdatedAt = company.UpdatedAt;
    }
}
