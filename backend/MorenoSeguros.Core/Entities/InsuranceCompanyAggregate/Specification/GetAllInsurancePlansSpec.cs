using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification;

public class GetAllInsurancePlansSpec : Specification<InsurancePlan>
{
    public GetAllInsurancePlansSpec()
    {
        Query.OrderByDescending(p => p.CreatedAt);
    }
}
