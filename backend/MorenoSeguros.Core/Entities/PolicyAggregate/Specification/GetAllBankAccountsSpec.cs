using Ardalis.Specification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.Specification
{
    public class GetAllBankAccountsSpec : Specification<BankAccount>
    {
        public GetAllBankAccountsSpec() => Query.OrderBy(b => b.Bank);
    }
}
