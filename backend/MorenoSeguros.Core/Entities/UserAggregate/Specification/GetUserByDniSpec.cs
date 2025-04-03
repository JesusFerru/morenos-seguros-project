using Ardalis.Specification;
using MorenoSeguros.Core.Entities.UserAggregate;

namespace MorenoSeguros.Core.Entities.UserAggregate.Specification
{
    public class GetUserByDniSpec : Specification<User>
    {
        public GetUserByDniSpec(string dni)
        {
            Query
               .Where(user => user.Dni.Equals(dni));
        }
    }
}
