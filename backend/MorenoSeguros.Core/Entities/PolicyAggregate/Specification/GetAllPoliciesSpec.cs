using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification;
public class GetAllPoliciesSpec : Specification<Policy>
{
    public GetAllPoliciesSpec()
    {
        Query.OrderByDescending(p => p.CreatedAt)
            .Include(p => p.Agent)
            .Include(p => p.TitularClient)
            .Include(p => p.DeductibleOption);
    }
}
