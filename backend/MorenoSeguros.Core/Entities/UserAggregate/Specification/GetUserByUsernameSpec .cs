using Ardalis.Specification;
using MorenoSeguros.Core.Entities.UserAggregate;

namespace MorenoSeguros.Core.Entities.UserAggregate.Specification
{
    public class GetUserByUsernameSpec : Specification<User>, ISingleResultSpecification<User>
    {
        public GetUserByUsernameSpec(string username)
        {
            Query.Where(u => u.Username == username);
        }
    }
}
