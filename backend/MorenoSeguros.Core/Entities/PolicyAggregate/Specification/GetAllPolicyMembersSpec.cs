using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification
{
    public class GetAllPolicyMembersSpec : Specification<PolicyMember>
    {
        public GetAllPolicyMembersSpec()
        {
            Query.Include(x => x.Client)
                 .Include(x => x.Policy);
        }
    }
}
