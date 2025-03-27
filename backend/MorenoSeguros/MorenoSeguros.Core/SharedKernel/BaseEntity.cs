namespace MorenoSeguros.Core.SharedKernel;

public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    protected BaseEntity()
    {
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}