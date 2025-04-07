using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.Interfaces;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Net.Mime;
using MorenoSeguros.Api.Dtos;
using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification.Deductibles;

namespace MorenoSeguros.Api.Controllers;

[ApiController]
[Route($"{RouteConstants.Route_V1}/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class DeductibleOptionsController : ControllerBase
{
    private readonly IRepository<DeductibleOption> _repository;
    private readonly IRepository<InsurancePlan> _planRepository;
    private readonly IEntityStateValidatorService _validator;

    public DeductibleOptionsController(
        IRepository<DeductibleOption> repository,
        IRepository<InsurancePlan> planRepository,
        IEntityStateValidatorService validator)
    {
        _repository = repository;
        _planRepository = planRepository;
        _validator = validator;
    }

    [HttpGet]
    [SwaggerOperation(Tags = [SwaggerConstants.DeductibleOptionTagSwagger])]
    [ProducesResponseType(typeof(List<DeductibleOptionResult>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<DeductibleOptionResult>>> GetAll()
    {
        var list = await _repository.ListAsync(new GetAllDeductibleOptionsSpec());
        var result = list.Select(x => new DeductibleOptionResult(x)).ToList();
        return Ok(result);
    }

    [HttpGet("active")]
    [SwaggerOperation(Tags = [SwaggerConstants.DeductibleOptionTagSwagger])]
    [ProducesResponseType(typeof(List<DeductibleOptionResult>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<DeductibleOptionResult>>> GetActive()
    {
        var list = await _repository.ListAsync(new GetActiveDeductibleOptionsSpec());
        var result = list.Select(x => new DeductibleOptionResult(x)).ToList();
        return Ok(result);
    }

    [HttpGet("plan/{planId}")]
    [SwaggerOperation(Tags = [SwaggerConstants.DeductibleOptionTagSwagger])]
    [ProducesResponseType(typeof(List<DeductibleOptionResult>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<List<DeductibleOptionResult>>> GetByPlanId(Guid planId)
    {
        var plan = await _planRepository.GetByIdAsync(planId) ?? 
            throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(InsurancePlan)));
        var list = await _repository.ListAsync(new GetDeductibleOptionsByPlanIdSpec(planId));
        var result = list.Select(x => new DeductibleOptionResult(x)).ToList();
        return Ok(result);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Tags = [SwaggerConstants.DeductibleOptionTagSwagger])]
    [ProducesResponseType(typeof(DeductibleOptionResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<DeductibleOptionResult>> GetById(Guid id)
    {
        var item = await _repository.FirstOrDefaultAsync(new GetDeductibleOptionByIdSpec(id)) ??
            throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(DeductibleOption)));
        return Ok(new DeductibleOptionResult(item));
    }

    [HttpPost]
    [SwaggerOperation(Tags = [SwaggerConstants.DeductibleOptionTagSwagger])]
    [ProducesResponseType(typeof(DeductibleOptionResult), (int)HttpStatusCode.Created)]
    public async Task<ActionResult<DeductibleOptionResult>> Create([FromBody] DeductibleOptionCommand request)
    {
        _validator.ValidateRequiredForeignKeysAsync<DeductibleOption>(new() { { nameof(request.InsurancePlanId), request.InsurancePlanId } });
        await _validator.ValidateIsActiveAsync(request.InsurancePlanId, _planRepository, nameof(InsurancePlan));

        var entity = new DeductibleOption(request.DeductibleIndividual, request.DeductibleFamily, request.Currency)
        {
            InsurancePlanId = request.InsurancePlanId
        };

        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, new DeductibleOptionResult(entity));
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Tags = [SwaggerConstants.DeductibleOptionTagSwagger])]
    [ProducesResponseType(typeof(DeductibleOptionResult), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<DeductibleOptionResult>> Update(Guid id, [FromBody] DeductibleOptionCommand request)
    {
        var entity = await _repository.FirstOrDefaultAsync(new GetDeductibleOptionByIdSpec(id)) ?? 
            throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(DeductibleOption)));
        _validator.ValidateRequiredForeignKeysAsync<DeductibleOption>(new() { { nameof(request.InsurancePlanId), request.InsurancePlanId } });
        await _validator.ValidateIsActiveAsync(request.InsurancePlanId, _planRepository, nameof(InsurancePlan));

        entity.Update(request.DeductibleIndividual, request.DeductibleFamily, request.Currency, request.IsActive);
        entity.InsurancePlanId = request.InsurancePlanId;

        await _repository.UpdateAsync(entity);
        await _repository.SaveChangesAsync();

        return Ok(new DeductibleOptionResult(entity));
    }
}
