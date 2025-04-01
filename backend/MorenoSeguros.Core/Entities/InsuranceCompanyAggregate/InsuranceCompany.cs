using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;
using MorenoSeguros.Core.SharedKernel;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.Entities.CompanyAggregate;

public class InsuranceCompany : BaseEntity, IAggregateRoot
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }

    // Navigation
    public List<InsurancePlan> Plans { get; set; } = new();

    public InsuranceCompany(string name, string description, string? logoUrl = null, string? websiteUrl = null)
    {
        Name = name;
        Description = description;
        LogoUrl = logoUrl;
        WebsiteUrl = websiteUrl;
    }

    public void UpdateInfo(string name, string description, string? logoUrl, string? websiteUrl)
    {
        Name = name;
        Description = description;
        LogoUrl = logoUrl;
        WebsiteUrl = websiteUrl;
    }
}
