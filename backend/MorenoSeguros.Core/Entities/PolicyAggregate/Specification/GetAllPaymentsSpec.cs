using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification
{
    public class GetAllPaymentsSpec : Specification<Payments>
    {
        public GetAllPaymentsSpec() => Query.OrderByDescending(p => p.PaymentDate);
    }
}
