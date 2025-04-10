using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification;

public class GetActiveInsurancePlansSpec : Specification<InsurancePlan>
{
    public GetActiveInsurancePlansSpec()
    {
        Query.Where(p => p.IsActive);
        Query.Include(p => p.InsuranceCompany);
        Query.OrderByDescending(p => p.CreatedAt);
    }
}
