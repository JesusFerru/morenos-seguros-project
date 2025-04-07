using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification.Deductibles;

public class GetDeductibleOptionsByPlanIdSpec : Specification<DeductibleOption>
{
    public GetDeductibleOptionsByPlanIdSpec(Guid planId)
    {
        Query.Where(x => x.InsurancePlanId == planId);
    }
}