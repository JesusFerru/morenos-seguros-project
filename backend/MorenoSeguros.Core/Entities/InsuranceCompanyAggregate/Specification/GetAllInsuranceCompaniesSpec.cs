using Ardalis.Specification;
using MorenoSeguros.Core.Entities.CompanyAggregate;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification;

public class GetAllInsuranceCompaniesSpec : Specification<InsuranceCompany>
{
    public GetAllInsuranceCompaniesSpec()
    {
        Query.OrderBy(c => c.Name);
    }
}
