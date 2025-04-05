namespace MorenoSeguros.Api.Dtos;

public class InsurancePlanResult
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public bool? IsActive { get; set; } = true;
    public DateTime? CreatedAt { get; set; }

    public InsurancePlanResult(Guid id, string name, string? description, bool? isActive, DateTime? createdAt)
    {
        Id = id;
        Name = name;
        Description = description;
        IsActive = isActive;
        CreatedAt = createdAt;
    }
}
