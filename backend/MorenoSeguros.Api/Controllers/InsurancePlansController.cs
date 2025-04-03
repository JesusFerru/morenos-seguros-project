using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using static MorenoSeguros.Core.SharedKernel.Constants.ErrorMessages;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using MorenoSeguros.Api.Dtos;
using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification;

namespace MorenoSeguros.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InsurancePlansController : ControllerBase
{
    private readonly IRepository<InsurancePlan> _repository;

    public InsurancePlansController(IRepository<InsurancePlan> repository)
    {
        _repository = repository;
    }

    [HttpGet]
    [SwaggerOperation(Tags = [SwaggerConstants.InsurancePlanTagSwagger])]
    [ProducesResponseType(typeof(List<InsurancePlanResult>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<InsurancePlanResult>>> GetAll()
    {
        var plans = await _repository.ListAsync(new GetAllInsurancePlansSpec());
        var result = plans.Select(p => new InsurancePlanResult(p.Id, p.Name, p.Description, p.IsActive, p.CreatedAt)).ToList();
        return Ok(result);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Tags = [SwaggerConstants.InsurancePlanTagSwagger])]
    [ProducesResponseType(typeof(InsurancePlanResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<InsurancePlanResult>> GetById(Guid id)
    {
        var plan = await _repository.FirstOrDefaultAsync(new GetInsurancePlanByIdSpec(id));
        if (plan is null)
            throw new NotFoundException(GetMessage(nameof(NotFoundException), nameof(InsurancePlan)));

        var result = new InsurancePlanResult(plan.Id, plan.Name, plan.Description, plan.IsActive, plan.CreatedAt);
        return Ok(result);
    }

    [HttpPost]
    [SwaggerOperation(Tags = [SwaggerConstants.InsurancePlanTagSwagger])]
    [ProducesResponseType(typeof(InsurancePlanResult), (int)HttpStatusCode.Created)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.Conflict)]
    public async Task<ActionResult<InsurancePlanResult>> Create([FromBody] StoreInsurancePlanCommand request)
    {
        var existing = await _repository.ListAsync();
        if (existing.Any(p => p.Name == request.Name))
            throw new ConflictException(GetMessage(ConflictErrorCode.ResourceAlreadyExists.ToString(), nameof(InsurancePlan)));

        var plan = new InsurancePlan(request.Name, request.Description);
        plan.InsuranceCompany = new Core.Entities.CompanyAggregate.InsuranceCompany("Temp", "") { Id = request.InsuranceCompanyId };

        await _repository.AddAsync(plan);
        await _repository.SaveChangesAsync();

        var result = new InsurancePlanResult(plan.Id, plan.Name, plan.Description, plan.IsActive, plan.CreatedAt);
        return CreatedAtAction(nameof(GetById), new { id = plan.Id }, result);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Tags = [SwaggerConstants.InsurancePlanTagSwagger])]
    [ProducesResponseType(typeof(InsurancePlanResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<InsurancePlanResult>> Update(Guid id, [FromBody] StoreInsurancePlanCommand request)
    {
        var plan = await _repository.FirstOrDefaultAsync(new GetInsurancePlanByIdSpec(id));
        if (plan is null)
            throw new NotFoundException(GetMessage(nameof(NotFoundException), nameof(InsurancePlan)));

        plan.Update(request.Name, request.Description);
        await _repository.UpdateAsync(plan);
        await _repository.SaveChangesAsync();

        var result = new InsurancePlanResult(plan.Id, plan.Name, plan.Description, plan.IsActive, plan.CreatedAt);
        return Ok(result);
    }
}
