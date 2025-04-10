using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification.Deductibles;

public class GetDeductibleOptionByIdSpec : Specification<DeductibleOption>
{
    public GetDeductibleOptionByIdSpec(Guid id)
    {
        Query.Where(x => x.Id == id);
    }
}
