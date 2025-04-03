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


    public InsuranceCompanyResult(Guid id, string name, string? description, string? logoUrl, string? websiteUrl, bool? isActive, DateTime? createdAt)
    {
        Id = id;
        Name = name;
        Description = description;
        LogoUrl = logoUrl;
        WebsiteUrl = websiteUrl;
        IsActive = isActive;
        CreatedAt = createdAt;
    }
}
