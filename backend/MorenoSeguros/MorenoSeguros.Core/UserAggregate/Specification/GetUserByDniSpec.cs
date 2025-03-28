using Ardalis.Specification;

namespace MorenoSeguros.Core.UserAggregate.Specification
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
