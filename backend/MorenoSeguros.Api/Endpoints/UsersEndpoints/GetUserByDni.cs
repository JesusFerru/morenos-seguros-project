using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Entities.UserAggregate;
using MorenoSeguros.Core.Entities.UserAggregate.Specification;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.Interfaces;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Net.Mime;

namespace MorenoSeguros.Api.Endpoints.UsersEndpoints
{
    public class GetUserByDni : EndpointBaseAsync
       .WithRequest<GetUserCommand>
       .WithActionResult<GetUserResult>
    {
        private readonly IRepository<User> _repository;
        public GetUserByDni(IRepository<User> repository, IAuthService authService)
        {
            _repository = repository;
        }

        [HttpGet($"{RouteConstants.Route_V1}/users/{{Dni}}")]
        [AllowAnonymous]
        [SwaggerOperation(
            OperationId = nameof(GetUserByDni),
            Tags = [SwaggerConstants.UserTagSwagger]
        )]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(GetUserResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        public async override Task<ActionResult<GetUserResult>> HandleAsync(GetUserCommand request, CancellationToken cancellationToken = default)
        {
            var spec = new GetUserByDniSpec(request.Dni);
            var user = await _repository.FirstOrDefaultAsync(spec, cancellationToken)
                ?? throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(User)));

            var result = new GetUserResult(user.Id, user.Dni, user.FirstName, user.LastName, user.Email, user.PhoneNumber, user.Role.Name, user.Username,
            user.IsActive,
            user.CreatedAt,
            user.UpdatedAt);
            return Ok(result);
        }
    }
}
