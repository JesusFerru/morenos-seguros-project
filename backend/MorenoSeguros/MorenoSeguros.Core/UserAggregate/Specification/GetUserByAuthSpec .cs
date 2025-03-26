using Ardalis.Specification;

namespace MorenoSeguros.Core.UserAggregate.Specification
{
    public class GetUserByAuthSpec : Specification<User>, ISingleResultSpecification<User>
    {
        public GetUserByAuthSpec(string username, string password)
        {
            Query.Where(u => u.Username == username && u.Password == password);
        }
    }
}
