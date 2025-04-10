using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.ClientAggregate.Specfication;

public class GetAllClientsSpec : Specification<Clients>
{
    public GetAllClientsSpec()
    {
        Query.OrderByDescending(c => c.CreatedAt);
    }
}
