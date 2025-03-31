using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Entities.UserAggregate;
using MorenoSeguros.Core.Entities.UserAggregate.Specification;
using MorenoSeguros.Core.Entities.UserAggregate.ValueObjects;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.Interfaces;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Net.Mime;
using static MorenoSeguros.Core.SharedKernel.Constants.ErrorMessages;

namespace MorenoSeguros.Api.Endpoints.UsersEndpoints
{
    [AllowAnonymous]
    public class StoreUser : EndpointBaseAsync
       .WithRequest<StoreUserCommand>
       .WithActionResult<StoreUserResult>
    {
        private readonly IRepository<User> _repository;
        private readonly IAuthService _authService;

        public StoreUser(IRepository<User> repository, IAuthService authService)
        {
            _repository = repository;
            _authService = authService;
        }

        [HttpPost($"{RouteConstants.Route_V1}/user")]
        [SwaggerOperation(
            OperationId = nameof(StoreUser),
            Tags = [SwaggerConstants.UserTagSwagger]
        )]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(StoreUserResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.InternalServerError)]
        public override async Task<ActionResult<StoreUserResult>> HandleAsync(StoreUserCommand request, CancellationToken cancellationToken = default)
        {
            var spec = new GetUserByDniSpec(request.Dni);
            var existingUser = await _repository.FirstOrDefaultAsync(spec, cancellationToken);
            if (existingUser != null)
            {
                throw new ConflictException(
                    GetMessage(
                        ConflictErrorCode.ResourceAlreadyExists.ToString(),
                        nameof(Core.Entities.UserAggregate.User)
                    )
                );
            }
            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Dni = request.Dni,
                PhoneNumber = request.PhoneNumber,
                Username = request.Username,
                Email = request.Email,
                Password = request.Password,
                Role = UserRole.FromName(request.Role)
            };
            // Hash Password
            user.Password = _authService.HashPassword(user, request.Password);

            await _repository.AddAsync(user, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);

            var result = new StoreUserResult
            {
                FullName = $"{user.FirstName} {user.LastName}",
                Dni = request.Dni,
                PhoneNumber = request.PhoneNumber,
                Username = request.Username,
                Email = request.Email,
                Role = request.Role
            };

            return Ok(result);
        }
    }
}
