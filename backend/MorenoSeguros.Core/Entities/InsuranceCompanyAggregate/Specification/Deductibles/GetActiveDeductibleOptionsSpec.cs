using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification.Deductibles;

public class GetActiveDeductibleOptionsSpec : Specification<DeductibleOption>
{
    public GetActiveDeductibleOptionsSpec()
    {
        Query.Where(x => x.IsActive)
             .OrderByDescending(x => x.CreatedAt);
    }
}