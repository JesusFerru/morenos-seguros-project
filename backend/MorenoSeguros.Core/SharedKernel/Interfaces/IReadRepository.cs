using Ardalis.Specification;

namespace MorenoSeguros.Core.SharedKernel.Interfaces;

public interface IReadRepository<T> : IReadRepositoryBase<T> where T : class, IAggregateRoot
{
    Task<List<T>> ListAsyncAsNoTrackin(CancellationToken cancellationToken = default);
}