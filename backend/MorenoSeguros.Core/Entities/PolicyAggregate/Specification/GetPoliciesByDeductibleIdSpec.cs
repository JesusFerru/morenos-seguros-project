using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification;
public class GetPoliciesByDeductibleIdSpec : Specification<Policy>
{
    public GetPoliciesByDeductibleIdSpec(Guid deductibleId)
    {
        Query
            .Where(p => p.DeductibleOptionId == deductibleId);
    }
}