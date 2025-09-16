// Api/Controllers/PoliciesController.cs
using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Entities.ClientAggregate;
using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;
using MorenoSeguros.Core.Entities.PolicyAggregate;
using MorenoSeguros.Core.Entities.PolicyAggregate.Specification;
using MorenoSeguros.Core.Entities.UserAggregate;
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
public class PoliciesController : ControllerBase
{
    private readonly IRepository<Policy> _repository;
    private readonly IRepository<Clients> _clientRepository;
    private readonly IRepository<DeductibleOption> _deductibleRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IEntityStateValidatorService _validator;

    public PoliciesController(
        IRepository<Policy> repository,
        IRepository<Clients> clientRepository,
        IRepository<DeductibleOption> deductibleRepository,
        IRepository<User> userRepository,
        IEntityStateValidatorService validator)
    {
        _repository = repository;
        _clientRepository = clientRepository;
        _deductibleRepository = deductibleRepository;
        _userRepository = userRepository;
        _validator = validator;
    }

    [HttpGet]
    [SwaggerOperation(Tags = [SwaggerConstants.PoliciesTagSwagger])]
    [ProducesResponseType(typeof(List<PolicyResult>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<PolicyResult>>> GetAll()
    {
        var policies = await _repository.ListAsync(new GetAllPoliciesSpec());
        var result = policies.Select(p => new PolicyResult(p)).ToList();
        return Ok(result);
    }

    [HttpGet("active")]
    [SwaggerOperation(Tags = [SwaggerConstants.PoliciesTagSwagger])]
    [ProducesResponseType(typeof(List<PolicyResult>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<PolicyResult>>> GetActive()
    {
        var policies = await _repository.ListAsync(new GetActivePoliciesSpec());
        var result = policies.Select(p => new PolicyResult(p)).ToList();
        return Ok(result);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Tags = [SwaggerConstants.PoliciesTagSwagger])]
    [ProducesResponseType(typeof(PolicyResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<PolicyResult>> GetById(Guid id)
    {
        var policy = await _repository.FirstOrDefaultAsync(new GetPolicyByIdSpec(id));
        if (policy is null)
            throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(Policy)));

        return Ok(new PolicyResult(policy));
    }

    [HttpPost]
    [SwaggerOperation(Tags = [SwaggerConstants.PoliciesTagSwagger])]
    [ProducesResponseType(typeof(PolicyResult), (int)HttpStatusCode.Created)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.Conflict)]
    public async Task<ActionResult<PolicyResult>> Create([FromBody] PolicyCommand request)
    {
        _validator.ValidateRequiredForeignKeysAsync<Policy>(new()
        {
            { nameof(request.TitularClientId), request.TitularClientId },
            { nameof(request.DeductibleOptionId), request.DeductibleOptionId }
        });

        await _validator.ValidateIsActiveAsync(request.TitularClientId, _clientRepository, nameof(Clients));
        await _validator.ValidateIsActiveAsync(request.DeductibleOptionId, _deductibleRepository, nameof(DeductibleOption));

        var policy = new Policy
        {
            PolicyNumber = request.PolicyNumber,
            PreviousPolicyNumber = request.PreviousPolicyNumber,
            TitularClientId = request.TitularClientId,
            AgentId = request.AgentId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            DeductibleOptionId = request.DeductibleOptionId,
            Status = request.Status
        };

        await _repository.AddAsync(policy);
        await _repository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = policy.Id }, new PolicyResult(policy));
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Tags = [SwaggerConstants.PoliciesTagSwagger])]
    [ProducesResponseType(typeof(PolicyResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<PolicyResult>> Update(Guid id, [FromBody] PolicyCommand request)
    {
        var policy = await _repository.FirstOrDefaultAsync(new GetPolicyByIdSpec(id));
        if (policy is null)
            throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(Policy)));

        _validator.ValidateRequiredForeignKeysAsync<Policy>(new()
        {
            { nameof(request.TitularClientId), request.TitularClientId },
            { nameof(request.DeductibleOptionId), request.DeductibleOptionId }
        });

        await _validator.ValidateIsActiveAsync(request.TitularClientId, _clientRepository, nameof(Clients));
        await _validator.ValidateIsActiveAsync(request.DeductibleOptionId, _deductibleRepository, nameof(DeductibleOption));

        policy.PolicyNumber = request.PolicyNumber;
        policy.PreviousPolicyNumber = request.PreviousPolicyNumber;
        policy.TitularClientId = request.TitularClientId;
        policy.AgentId = request.AgentId;
        policy.StartDate = request.StartDate;
        policy.EndDate = request.EndDate;
        policy.DeductibleOptionId = request.DeductibleOptionId;
        policy.Status = request.Status;

        await _repository.UpdateAsync(policy);
        await _repository.SaveChangesAsync();

        return Ok(new PolicyResult(policy));
    }

    [HttpGet("client/{clientId}")]
    [SwaggerOperation(Tags = [SwaggerConstants.PoliciesTagSwagger])]
    [ProducesResponseType(typeof(List<PolicyResult>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<PolicyResult>>> GetByClientId(Guid clientId)
    {
        var client = await _clientRepository.GetByIdAsync(clientId);
        if (client is null)
            throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(Clients)));

        var policies = await _repository.ListAsync(new GetPoliciesByClientIdSpec(clientId));
        var result = policies.Select(p => new PolicyResult(p)).ToList();
        return Ok(result);
    }

    [HttpGet("deductible/{deductibleId}")]
    [SwaggerOperation(Tags = [SwaggerConstants.PoliciesTagSwagger])]
    [ProducesResponseType(typeof(List<PolicyResult>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<PolicyResult>>> GetByDeductibleId(Guid deductibleId)
    {
        var deductible = await _deductibleRepository.GetByIdAsync(deductibleId);
        if (deductible is null)
            throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(DeductibleOption)));

        var policies = await _repository.ListAsync(new GetPoliciesByDeductibleIdSpec(deductibleId));
        var result = policies.Select(p => new PolicyResult(p)).ToList();
        return Ok(result);
    }

    [HttpGet("agent/{agentId}")]
    [SwaggerOperation(Tags = [SwaggerConstants.PoliciesTagSwagger])]
    [ProducesResponseType(typeof(List<PolicyResult>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<PolicyResult>>> GetByAgentId(Guid agentId)
    {
        var agent = await _userRepository.GetByIdAsync(agentId);
        if (agent is null)
            throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(User)));

        var policies = await _repository.ListAsync(new GetPoliciesByAgentIdSpec(agentId));
        var result = policies.Select(p => new PolicyResult(p)).ToList();
        return Ok(result);
    }
}