using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.UserAggregate;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Net.Mime;

namespace MorenoSeguros.Api.Endpoints.UsersEndpoints
{
    public class GetProfileUser : EndpointBaseAsync
       .WithRequest<GetUserCommand>
       .WithActionResult<GetUserResult>
    {
        public GetProfileUser() { }

        [HttpGet($"{RouteConstants.Route_V1}/get-user/{{Ci}}")]
        [AllowAnonymous]
        [SwaggerOperation(
            OperationId = nameof(GetProfileUser),
            Tags = [SwaggerConstants.UserTagSwagger]
        )]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(GetUserResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        public async override Task<ActionResult<GetUserResult>> HandleAsync(GetUserCommand request, CancellationToken cancellationToken = default)
        {
            // Simulación de un usuario estático para prueba en Swagger
            await Task.Delay(1, cancellationToken);
            // public User( string firstName, string lastName, string ci, string email)
            var mockUser = new User("Juan", "Perez", "12345", "70000000", "jperez", "johndoe@example.com", "Admin");

            // Simula búsqueda de usuario por AuthUserId
            if (request.Ci != mockUser.Ci)
            {
                throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(User)));
            }

            var result = new GetUserResult(mockUser.Ci, $"{mockUser.FirstName} {mockUser.LastName}", mockUser.Email);
            return Ok(result);
        }
    }
}
