using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification;

public class GetPolicyMembersByPolicyIdSpec : Specification<PolicyMember>
{
    public GetPolicyMembersByPolicyIdSpec(Guid policyId)
    {
        Query.Where(x => x.Policy != null && x.Policy.Id == policyId)
             .Include(x => x.Client)
             .Include(x => x.Policy);
    }
}
