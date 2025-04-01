using Ardalis.Specification;

namespace MorenoSeguros.Core.Entities.UserAggregate.Specification;

public class GetAllUsersSpec : Specification<User>
{
    public GetAllUsersSpec()
    {
        Query.OrderBy(u => u.FirstName);
    }
}