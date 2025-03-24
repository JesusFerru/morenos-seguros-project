using Microsoft.EntityFrameworkCore;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using MorenoSeguros.Infrastructure.Data;

namespace MorenoSeguros.Infrastructure
{
    public static class InfrastructureServiceExtensions
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            //Generics repos
            services.AddScoped(typeof(IRepository<>), typeof(EFRepository<>))
                    .AddScoped(typeof(IReadRepository<>), typeof(EFRepository<>));

            //Services
            //    services.AddScoped<IDebmediaService, DebmediaService>();

            // Get ConnectionString
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string not found.");

            // Add DbContext from PostgreSQL
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(connectionString));
            //Strategies

            //Settings
            return services;
        }
    }
}
