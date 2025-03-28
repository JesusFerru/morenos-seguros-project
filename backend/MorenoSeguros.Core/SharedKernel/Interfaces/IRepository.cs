using Ardalis.Specification;
namespace MorenoSeguros.Core.SharedKernel.Interfaces;

public interface IRepository<T> : IRepositoryBase<T> where T : class, IAggregateRoot
{
    Task<T> SingleOrDefaultWithErrorMessage(ISingleResultSpecification<T> specification, string errorMessage, CancellationToken cancellationToken = default);
}
