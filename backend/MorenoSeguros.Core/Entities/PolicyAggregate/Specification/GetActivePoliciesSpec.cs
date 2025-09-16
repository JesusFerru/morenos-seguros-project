using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification;
public class GetActivePoliciesSpec : Specification<Policy>
{
    public GetActivePoliciesSpec()
    {
        Query.Where(p => p.IsActive);
    }
}
