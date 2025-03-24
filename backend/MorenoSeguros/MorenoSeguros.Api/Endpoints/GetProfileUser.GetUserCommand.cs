using Microsoft.AspNetCore.Mvc;

namespace MorenoSeguros.Api.Endpoints
{
    public class GetUserCommand
    {
        [FromRoute]
        public string Ci { get; set; } = string.Empty;
    }
}
