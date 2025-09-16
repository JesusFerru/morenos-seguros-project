using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification;

public class GetPolicyByIdSpec : Specification<Policy>
{
    public GetPolicyByIdSpec(Guid id)
    {
        Query.Where(p => p.Id == id);
    }
}
