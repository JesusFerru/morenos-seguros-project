// Api/Controllers/PolicyMembersController.cs
using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Entities.ClientAggregate;
using MorenoSeguros.Core.Entities.PolicyAggregate;
using MorenoSeguros.Core.Entities.PolicyAggregate.Specification;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.Interfaces;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Net.Mime;

namespace MorenoSeguros.Api.Controllers;

[ApiController]
[Route($"{RouteConstants.Route_V1}/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class PolicyMembersController : ControllerBase
{
    private readonly IRepository<PolicyMember> _repository;
    private readonly IRepository<Clients> _clientRepository;
    private readonly IRepository<Policy> _policyRepository;
    private readonly IEntityStateValidatorService _validator;

    public PolicyMembersController(
        IRepository<PolicyMember> repository,
        IRepository<Clients> clientRepository,
        IRepository<Policy> policyRepository,
        IEntityStateValidatorService validator)
    {
        _repository = repository;
        _clientRepository = clientRepository;
        _policyRepository = policyRepository;
        _validator = validator;
    }

    [HttpGet]
    [SwaggerOperation(Tags = [SwaggerConstants.PolicyMembersTagSwagger])]
    [ProducesResponseType(typeof(List<PolicyMemberResult>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<PolicyMemberResult>>> GetAll()
    {
        var members = await _repository.ListAsync(new GetAllPolicyMembersSpec());
        return Ok(members.Select(m => new PolicyMemberResult(m)).ToList());
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Tags = [SwaggerConstants.PolicyMembersTagSwagger])]
    [ProducesResponseType(typeof(PolicyMemberResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<PolicyMemberResult>> GetById(Guid id)
    {
        var member = await _repository.FirstOrDefaultAsync(new GetPolicyMemberByIdSpec(id)) ??
            throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(PolicyMember)));

        return Ok(new PolicyMemberResult(member));
    }

    [HttpGet("policy/{policyId}")]
    [SwaggerOperation(Tags = [SwaggerConstants.PolicyMembersTagSwagger])]
    [ProducesResponseType(typeof(List<PolicyMemberResult>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<PolicyMemberResult>>> GetByPolicyId(Guid policyId)
    {
        var policy = await _policyRepository.GetByIdAsync(policyId);
        if (policy is null)
            throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(Policy)));

        var members = await _repository.ListAsync(new GetPolicyMembersByPolicyIdSpec(policyId));
        return Ok(members.Select(m => new PolicyMemberResult(m)).ToList());
    }

    [HttpGet("client/{clientId}")]
    [SwaggerOperation(Tags = [SwaggerConstants.PolicyMembersTagSwagger])]
    [ProducesResponseType(typeof(List<PolicyMemberResult>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<PolicyMemberResult>>> GetByClientId(Guid clientId)
    {
        var client = await _clientRepository.GetByIdAsync(clientId);
        if (client is null)
            throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(Clients)));

        var members = await _repository.ListAsync(new GetPolicyMembersByClientIdSpec(clientId));
        return Ok(members.Select(m => new PolicyMemberResult(m)).ToList());
    }
}
