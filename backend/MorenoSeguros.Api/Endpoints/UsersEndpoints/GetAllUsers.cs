namespace MorenoSeguros.Api.Endpoints.UsersEndpoints;

using Ardalis.ApiEndpoints;
using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Entities.UserAggregate;
using MorenoSeguros.Core.Entities.UserAggregate.Specification;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Net.Mime;

public class GetAllUsers : EndpointBaseAsync
    .WithoutRequest
    .WithActionResult<List<GetUserResult>>
{
    private readonly IRepository<User> _repository;

    public GetAllUsers(IRepository<User> repository)
    {
        _repository = repository;
    }

    [HttpGet($"{RouteConstants.Route_V1}/users")]
    [SwaggerOperation(
       OperationId = nameof(GetAllUsers),
       Tags = [SwaggerConstants.UserTagSwagger]
   )]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(List<GetUserResult>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.InternalServerError)]
    public override async Task<ActionResult<List<GetUserResult>>> HandleAsync(CancellationToken cancellationToken = default)
    {
        var spec = new GetAllUsersSpec();
        var users = await _repository.ListAsync(spec, cancellationToken);

        var result = users.Select(u => new GetUserResult(
            u.Id,
            u.Dni,
            u.FirstName,
            u.LastName,
            u.Email,
            u.PhoneNumber,
            u.Role.Name,
            u.Username,
            u.IsActive,
            u.CreatedAt,
            u.UpdatedAt
        )).ToList();

        return Ok(result);
    }
}
