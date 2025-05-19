using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification;

public class GetPolicyMemberByIdSpec : Specification<PolicyMember>
{
    public GetPolicyMemberByIdSpec(Guid id)
    {
        Query.Where(x => x.Id == id)
             .Include(x => x.Client)
             .Include(x => x.Policy);
    }
}
