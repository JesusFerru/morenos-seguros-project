using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.UserAggregate;
using System.Net;
using System.Net.Mime;

namespace MorenoSeguros.Api.Endpoints
{
    public class GetProfileUser : EndpointBaseAsync
       .WithRequest<GetUserCommand>
       .WithActionResult<GetUserResult>
    {
        public GetProfileUser() { }

        [HttpGet($"{RouteConstants.Route}/get-user/{{Ci}}")]
        [AllowAnonymous]
        //     [SwaggerOperation(OperationId = "Get User", Tags = ["User"])]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(GetUserResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        public async override Task<ActionResult<GetUserResult>> HandleAsync(GetUserCommand request, CancellationToken cancellationToken = default)
        {
            // Simulación de un usuario estático para prueba en Swagger
            await Task.Delay(1, cancellationToken);
            // public User( string firstName, string lastName, string ci, string email)
            var mockUser = new User("Juan", "Perez", "12345", "johndoe@example.com");

            // Simula búsqueda de usuario por AuthUserId
            if (request.Ci != mockUser.Ci)
            {
                throw new NotFoundException("Usuario no encontrado");
            }

            var result = new GetUserResult(mockUser.Ci, $"{mockUser.FirstName} {mockUser.LastName}", mockUser.Email);
            return Ok(result);
        }
    }
}
