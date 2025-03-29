using Microsoft.AspNetCore.Mvc;

namespace MorenoSeguros.Api.Endpoints.UsersEndpoints
{
    public class GetUserCommand
    {
        [FromRoute]
        public string Dni { get; set; } = string.Empty;
    }
}
