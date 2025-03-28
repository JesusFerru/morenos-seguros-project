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
    public class RefreshToken : EndpointBaseAsync
        .WithRequest<RefreshTokenCommand>
        .WithActionResult<LoginResult>
    {
        private readonly IAuthService _authService;

        public RefreshToken(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost($"{RouteConstants.Route_V1}/refresh-token")]
        [SwaggerOperation(
            OperationId = nameof(RefreshToken),
            Tags = [SwaggerConstants.UserTagSwagger]
        )]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(LoginResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.InternalServerError)]
        public override async Task<ActionResult<LoginResult>> HandleAsync(RefreshTokenCommand request, CancellationToken cancellationToken = default)
        {
            try
            {
                var result = await _authService.RefreshTokenAsync(request.AccessToken, request.RefreshToken);

                return Ok(result);
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }
        }
    }
}
