using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Auth;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.Interfaces;
using MorenoSeguros.Core.SharedKernel.Constants;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Net.Mime;

namespace MorenoSeguros.Api.Endpoints.Login
{
    [AllowAnonymous]
    public class LoginUser : EndpointBaseAsync
        .WithRequest<LoginCommand>
        .WithActionResult<LoginResult>
    {
        private readonly IAuthService _authService;

        public LoginUser(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost($"{RouteConstants.Route_V1}/login")]
        [SwaggerOperation(
            OperationId = nameof(LoginUser),
            Tags = new[] { SwaggerConstants.UserTagSwagger }
        )]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(LoginResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.InternalServerError)]
        public override async Task<ActionResult<LoginResult>> HandleAsync(LoginCommand request, CancellationToken cancellationToken = default)
        {
            var result = await _authService.AuthenticateAsync(request.Username, request.Password)
                ?? throw new UnauthorizedException(ErrorMessages.GetMessage(nameof(UnauthorizedException)));

            return Ok(result);
        }
    }
}
