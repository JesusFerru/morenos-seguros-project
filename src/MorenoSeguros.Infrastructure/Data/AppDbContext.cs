using Microsoft.EntityFrameworkCore.ChangeTracking;
using MorenoSeguros.Core;
using MorenoSeguros.Core.ContributorAggregate;
using MorenoSeguros.Core.UserAggregate;

namespace MorenoSeguros.Infrastructure.Data;

public class AppDbContext : DbContext
{
  private readonly IDomainEventDispatcher? _dispatcher;
  public AppDbContext(DbContextOptions<AppDbContext> options,
  IDomainEventDispatcher? dispatcher) : base(options)
  {
    _dispatcher = dispatcher;
  }
  public DbSet<Contributor> Contributors => Set<Contributor>();
  public DbSet<User> Users => Set<User>();
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
  }

  public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
  {
    UpdateEntityTimestamps();
    int result = await base.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

    if (_dispatcher != null)
    {
      var entitiesWithEvents = ChangeTracker.Entries<HasDomainEventsBase>()
          .Select(e => e.Entity)
          .Where(e => e.DomainEvents.Any())
          .ToArray();

      await _dispatcher.DispatchAndClearEvents(entitiesWithEvents);
    }

    return result;
  }

  public override int SaveChanges() =>
        SaveChangesAsync().GetAwaiter().GetResult();

  private void UpdateEntityTimestamps()
  {
    // Every Entity inherance from BaseEntity
    foreach (EntityEntry<BaseEntity> entry in ChangeTracker.Entries<BaseEntity>())
    {
      if (entry.State == EntityState.Added)
      {
        entry.Entity.CreatedAt = DateTime.UtcNow;
        entry.Entity.UpdatedAt = DateTime.UtcNow;
        entry.Entity.IsActive = true;
      }
      else if (entry.State == EntityState.Modified)
      {
        // Avoid to modify CreatedAt
        entry.Property(x => x.CreatedAt).IsModified = false;
        entry.Entity.UpdatedAt = DateTime.UtcNow;
      }
    }
  }
}
