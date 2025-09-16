using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification
{
    public class GetPaymentByIdSpec : Specification<Payments>
    {
        public GetPaymentByIdSpec(Guid id) => Query.Where(p => p.Id == id);
    }
}
