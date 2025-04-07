using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.ClientAggregate.Specfication;

public class GetClientsByIdSpec : Specification<Clients>
{
    public GetClientsByIdSpec(Guid id)
    {
        Query.Where(c => c.Id == id);
    }
}