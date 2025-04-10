using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.Interfaces
{
    public interface IEntityStateValidatorService
    {
        Task ValidateIsActiveAsync<T>(Guid entityId, IRepository<T> repository, string entityName) where T : class, IAggregateRoot;
        void ValidateRequiredForeignKeysAsync<T>(Dictionary<string, Guid> foreignKeys) where T : class, IAggregateRoot;
    }
}
