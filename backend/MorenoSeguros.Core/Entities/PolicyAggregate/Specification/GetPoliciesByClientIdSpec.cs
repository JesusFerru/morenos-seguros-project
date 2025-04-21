using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification;
public class GetPoliciesByClientIdSpec : Specification<Policy>
{
    public GetPoliciesByClientIdSpec(Guid clientId)
    {
        Query
            .Where(p => p.TitularClientId == clientId);
    }
}
