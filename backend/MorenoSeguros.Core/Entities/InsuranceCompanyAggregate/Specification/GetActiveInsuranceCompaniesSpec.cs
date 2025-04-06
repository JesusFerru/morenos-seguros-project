using Ardalis.Specification;
using MorenoSeguros.Core.Entities.CompanyAggregate;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification;

public class GetActiveInsuranceCompaniesSpec : Specification<InsuranceCompany>
{
    public GetActiveInsuranceCompaniesSpec()
    {
        Query.Where(c => c.IsActive)
             .OrderByDescending(c => c.CreatedAt);
    }
}
