using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification.Deductibles;

public class GetAllDeductibleOptionsSpec : Specification<DeductibleOption>
{
    public GetAllDeductibleOptionsSpec()
    {
        Query.OrderByDescending(x => x.CreatedAt)
            .Include(x => x.InsurancePlan);
    }
}
