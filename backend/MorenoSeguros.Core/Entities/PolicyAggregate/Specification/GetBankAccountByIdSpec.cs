using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification;

public class GetBankAccountByIdSpec : Specification<BankAccount>
{
    public GetBankAccountByIdSpec(Guid id) => Query.Where(b => b.Id == id);
}
