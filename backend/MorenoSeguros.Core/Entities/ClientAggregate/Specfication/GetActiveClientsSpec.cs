using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.ClientAggregate.Specfication;

public class GetActiveClientsSpec : Specification<Clients>
{
    public GetActiveClientsSpec()
    {
        Query.Where(c => c.IsActive).OrderByDescending(c => c.CreatedAt);
    }
}
