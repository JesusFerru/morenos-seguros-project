using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.Interfaces;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using MorenoSeguros.Core.UserAggregate;
using MorenoSeguros.Core.UserAggregate.Specification;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Net.Mime;

namespace MorenoSeguros.Api.Endpoints.UsersEndpoints
{
    public class GetProfileUser : EndpointBaseAsync
       .WithRequest<GetUserCommand>
       .WithActionResult<GetUserResult>
    {
        private readonly IRepository<User> _repository;
        public GetProfileUser(IRepository<User> repository, IAuthService authService)
        {
            _repository = repository;
        }

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
            var spec = new GetUserByCiSpec(request.Ci);
            var user = await _repository.FirstOrDefaultAsync(spec, cancellationToken)
                ?? throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(User)));

            var result = new GetUserResult(user.Ci, $"{user.FirstName} {user.LastName}", user.Email, user.PhoneNumber, user.Role.Name);
            return Ok(result);
        }
    }
}
