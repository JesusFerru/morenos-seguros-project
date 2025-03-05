namespace MorenoSeguros.Core;

public abstract class BaseEntity
{
  public int Id { get; set; }
  public bool IsActive { get; set; } = true;
  public DateTime CreatedAt { get; set; }
  public DateTime UpdatedAt { get; set; }
  protected BaseEntity()
  {
    CreatedAt = DateTime.UtcNow;
    UpdatedAt = DateTime.UtcNow;
  }

}
