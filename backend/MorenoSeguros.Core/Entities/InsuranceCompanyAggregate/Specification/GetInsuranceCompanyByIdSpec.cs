using Ardalis.Specification;
using MorenoSeguros.Core.Entities.CompanyAggregate;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification;

public class GetInsuranceCompanyByIdSpec : Specification<InsuranceCompany>
{
    public GetInsuranceCompanyByIdSpec(Guid id)
    {
        Query.Where(c => c.Id == id);
    }
}
