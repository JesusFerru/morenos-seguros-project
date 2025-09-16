using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification;

public class GetPolicyMembersByClientIdSpec : Specification<PolicyMember>
{
    public GetPolicyMembersByClientIdSpec(Guid clientId)
    {
        Query.Where(x => x.Client != null && x.Client.Id == clientId)
             .Include(x => x.Client)
             .Include(x => x.Policy);
    }
}
