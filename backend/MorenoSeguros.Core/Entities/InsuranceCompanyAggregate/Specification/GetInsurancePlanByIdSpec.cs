using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification
{
    public class GetInsurancePlanByIdSpec : Specification<InsurancePlan>
    {
        public GetInsurancePlanByIdSpec(Guid id)
        {
            Query.Where(p => p.Id == id);
            Query.Include(p => p.InsuranceCompany);
        }
    }
}
