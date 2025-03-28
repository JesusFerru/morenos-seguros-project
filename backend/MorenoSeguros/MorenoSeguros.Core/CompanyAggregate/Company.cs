using MorenoSeguros.Core.PlansAggregate;
using MorenoSeguros.Core.SharedKernel;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.CompanyAggregate
{
    public class Company : BaseEntity, IAggregateRoot
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ICollection<Plans> Plans { get; set; } = new List<Plans>();
    }
}
