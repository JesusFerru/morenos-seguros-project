using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Infrastructure.Data
{
    public class EFRepository<T> : RepositoryBaseLocal<T>, IReadRepository<T>, IRepository<T> where T : class, IAggregateRoot
    {
        public EFRepository(AppDbContext dbContext) : base(dbContext)
        {
        }
    }
}
