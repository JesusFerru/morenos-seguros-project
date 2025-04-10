using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification;

public class GetInsurancePlansByCompanyIdSpec : Specification<InsurancePlan>
{
    public GetInsurancePlansByCompanyIdSpec(Guid companyId)
    {
        Query.Where(p => p.InsuranceCompanyId == companyId && p.IsActive);
    }
}
