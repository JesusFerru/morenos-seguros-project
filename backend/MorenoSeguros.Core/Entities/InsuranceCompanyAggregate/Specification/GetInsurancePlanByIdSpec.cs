using Ardalis.Specification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification
{
    public class GetInsurancePlanByIdSpec : Specification<InsurancePlan>
    {
        public GetInsurancePlanByIdSpec(Guid id)
        {
            Query.Where(p => p.Id == id);
        }
    }
}
