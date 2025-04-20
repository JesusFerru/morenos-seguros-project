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

namespace MorenoSeguros.Api.Endpoints.UsersEndpoints;

[AllowAnonymous]
[Route(RouteConstants.Route_V1 + "/users")]
public class UpdateUser : EndpointBaseAsync
    .WithRequest<UpdateUserCommand>
    .WithActionResult<GetUserResult>
{
    private readonly IRepository<User> _repository;
    private readonly IAuthService _authService;

    public UpdateUser(IRepository<User> repository, IAuthService authService)
    {
        _repository = repository;
        _authService = authService;
    }

    [HttpPut("{dni}")]
    [SwaggerOperation(
        OperationId = nameof(UpdateUser),
        Tags = [SwaggerConstants.UserTagSwagger]
    )]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(GetUserResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
    public override async Task<ActionResult<GetUserResult>> HandleAsync(UpdateUserCommand request, CancellationToken cancellationToken = default)
    {
        var spec = new GetUserByDniSpec(request.Dni);
        var user = await _repository.FirstOrDefaultAsync(spec, cancellationToken)
            ?? throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(User)));

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.PhoneNumber = request.PhoneNumber;
        user.Email = request.Email;
        user.Role = UserRole.FromName(request.Role);
        user.IsActive = request.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.Password = _authService.HashPassword(user, request.Password);
        }

        await _repository.UpdateAsync(user, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        var result = new GetUserResult(
            user.Dni,
            $"{user.FirstName} {user.LastName}",
            user.Email,
            user.PhoneNumber,
            user.Role.Name,
            user.Username,
            user.IsActive,
            user.CreatedAt,
            user.UpdatedAt
        );

        return Ok(result);
    }
}
