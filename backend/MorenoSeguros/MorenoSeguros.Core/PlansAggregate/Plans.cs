using MorenoSeguros.Core.CompanyAggregate;
using MorenoSeguros.Core.SharedKernel;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.PlansAggregate
{
    public class Plans : BaseEntity, IAggregateRoot
    {
        public string Name { get; set; } = string.Empty;
        public Company? Company { get; set; }
    }
}
