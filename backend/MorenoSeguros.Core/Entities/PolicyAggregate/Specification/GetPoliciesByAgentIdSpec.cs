using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification;
public class GetPoliciesByAgentIdSpec : Specification<Policy>
{
    public GetPoliciesByAgentIdSpec(Guid agentId)
    {
        Query
            .Where(p => p.AgentId == agentId);
    }
}