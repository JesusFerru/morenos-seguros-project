using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using MorenoSeguros.Core.Interfaces;

namespace MorenoSeguros.Infrastructure.Services;

public class EntityStateValidatorService : IEntityStateValidatorService
{
    public async Task ValidateIsActiveAsync<T>(Guid entityId, IRepository<T> repository, string entityName) where T : class, IAggregateRoot
    {
        var entity = await repository.GetByIdAsync(entityId);

        if (entity is null)
            throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), entityName));

        var isActiveProp = typeof(T).GetProperty("IsActive");
        if (isActiveProp == null || isActiveProp.PropertyType != typeof(bool))
            throw new BadRequestException($"Entidad {entityName} no contiene propiedad IsActive válida");

        var isActive = (bool)isActiveProp.GetValue(entity)!;
        if (!isActive)
            throw new ConflictException($"No se puede operar con un {entityName} inactivo.");
    }

    public void ValidateRequiredForeignKeysAsync<T>(Dictionary<string, Guid> foreignKeys) where T : class, IAggregateRoot
    {
        foreach (var (name, id) in foreignKeys)
        {
            if (id == Guid.Empty)
                throw new BadRequestException($"El campo '{name}' es obligatorio y no puede estar vacío al registrar o actualizar {typeof(T).Name}.");
        }
    }

}