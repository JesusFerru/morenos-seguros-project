using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using MorenoSeguros.Infrastructure.Data;
using System.Diagnostics;

namespace MorenoSeguros.Migration;

public class ApiDbInitializer(
     IServiceProvider serviceProvider,
    IHostApplicationLifetime hostApplicationLifetime) : BackgroundService
{
    public const string ActivitySourceName = "Migrations";
    private static readonly ActivitySource s_activitySource = new(ActivitySourceName);

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        using var activity = s_activitySource.StartActivity("Migrating database", ActivityKind.Client);

        try
        {
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            await EnsureDatabaseAsync(dbContext, cancellationToken);
            await RunMigrationAsync(dbContext, cancellationToken);
        }
        catch (Exception ex)
        {
            activity?.AddException(ex);
            throw;
        }

        hostApplicationLifetime.StopApplication();
    }

    private static async Task EnsureDatabaseAsync(AppDbContext dbContext, CancellationToken cancellationToken)
    {
        var dbCreator = dbContext.GetService<IRelationalDatabaseCreator>();

        var strategy = dbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            // Create the database if it does not exist.
            // Do this first so there is then a database to start a transaction against.
            if (!await dbCreator.ExistsAsync(cancellationToken))
            {
                await dbCreator.CreateAsync(cancellationToken);
            }
        });
    }

    private static async Task RunMigrationAsync(AppDbContext dbContext, CancellationToken cancellationToken)
    {
        // https://github.com/dotnet/EntityFramework.Docs/pull/4897/files
        // https://learn.microsoft.com/en-us/dotnet/aspire/database/ef-core-migrations
        // https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-9.0/whatsnew#migrations
        // https://github.com/dotnet/efcore/issues/35127
        // https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-9.0/breaking-changes#exception-is-thrown-when-applying-migrations-if-there-are-pending-model-changes
        await dbContext.Database.MigrateAsync(cancellationToken);
    }
}
