using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using MorenoSeguros.Core.Entities.UserAggregate;
using MorenoSeguros.Core.SharedKernel;

namespace MorenoSeguros.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();

    public AppDbContext(DbContextOptions<AppDbContext> options)
       : base(options)
    {

    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        UpdateEntityTimestamps();
        int result = await base.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return result;
    }
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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}