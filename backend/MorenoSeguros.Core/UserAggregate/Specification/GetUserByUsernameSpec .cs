using Ardalis.Specification;

namespace MorenoSeguros.Core.UserAggregate.Specification
{
    public class GetUserByUsernameSpec : Specification<User>, ISingleResultSpecification<User>
    {
        public GetUserByUsernameSpec(string username)
        {
            Query.Where(u => u.Username == username);
        }
    }
}
