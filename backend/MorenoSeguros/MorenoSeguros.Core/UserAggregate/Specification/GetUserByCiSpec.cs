using Ardalis.Specification;

namespace MorenoSeguros.Core.UserAggregate.Specification
{
    public class GetUserByCiSpec : Specification<User>
    {
        public GetUserByCiSpec(string ci)
        {
            Query
               .Where(user => user.Ci.Equals(ci));
        }
    }
}
