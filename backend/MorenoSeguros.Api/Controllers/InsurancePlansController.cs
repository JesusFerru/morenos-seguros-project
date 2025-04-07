using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using MorenoSeguros.Api.Dtos;
using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification;
using MorenoSeguros.Core.Interfaces;
using MorenoSeguros.Core.Entities.CompanyAggregate;
using System.Net.Mime;

namespace MorenoSeguros.Api.Controllers
{
    [Route($"{RouteConstants.Route_V1}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    public class InsurancePlansController : ControllerBase
    {
        private readonly IRepository<InsurancePlan> _repository;
        private readonly IRepository<InsuranceCompany> _companyRepository;
        private readonly IEntityStateValidatorService _validator;

        public InsurancePlansController(IRepository<InsurancePlan> repository, IRepository<InsuranceCompany> companyRepository, IEntityStateValidatorService validator)
        {
            _repository = repository;
            _companyRepository = companyRepository;
            _validator = validator;
        }

        [HttpGet]
        [SwaggerOperation(Tags = [SwaggerConstants.InsurancePlanTagSwagger])]
        [ProducesResponseType(typeof(List<InsurancePlanResult>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<List<InsurancePlanResult>>> GetAll()
        {
            var plans = await _repository.ListAsync(new GetAllInsurancePlansSpec());
            var result = plans.Select(p => new InsurancePlanResult(p)).ToList();
            return Ok(result);
        }

        [HttpGet("active")]
        [SwaggerOperation(Tags = [SwaggerConstants.InsurancePlanTagSwagger])]
        [ProducesResponseType(typeof(List<InsurancePlanResult>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<List<InsurancePlanResult>>> GetActive()
        {
            var plans = await _repository.ListAsync(new GetActiveInsurancePlansSpec());
            var result = plans.Select(p => new InsurancePlanResult(p)).ToList();
            return Ok(result);
        }

        [HttpGet("company/{companyId}")]
        [SwaggerOperation(Tags = [SwaggerConstants.InsurancePlanTagSwagger])]
        [ProducesResponseType(typeof(List<InsurancePlanResult>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
        public async Task<ActionResult<List<InsurancePlanResult>>> GetByCompanyId(Guid companyId)
        {
            var company = await _companyRepository.GetByIdAsync(companyId);
            if (company is null)
                throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(InsuranceCompany)));

            var plans = await _repository.ListAsync(new GetInsurancePlansByCompanyIdSpec(companyId));
            var result = plans.Select(p => new InsurancePlanResult(p)).ToList();
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
            {
                throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(InsurancePlan)));
            }
            var result = new InsurancePlanResult(plan);
            return Ok(result);
        }

        [HttpPost]
        [SwaggerOperation(Tags = [SwaggerConstants.InsurancePlanTagSwagger])]
        [ProducesResponseType(typeof(InsurancePlanResult), (int)HttpStatusCode.Created)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.Conflict)]
        public async Task<ActionResult<InsurancePlanResult>> Create([FromBody] InsurancePlanCommand request)
        {
            _validator.ValidateRequiredForeignKeysAsync<InsurancePlan>(new()
            {
                { nameof(request.InsuranceCompanyId), request.InsuranceCompanyId }
            });

            await _validator.ValidateIsActiveAsync(request.InsuranceCompanyId, _companyRepository, nameof(InsuranceCompany));

            var plan = new InsurancePlan(request.Name, request.Description)
            {
                InsuranceCompanyId = request.InsuranceCompanyId
            };

            await _repository.AddAsync(plan);
            await _repository.SaveChangesAsync();

            var result = new InsurancePlanResult(plan);
            return CreatedAtAction(nameof(GetById), new { id = plan.Id }, result);
        }

        [HttpPut("{id}")]
        [SwaggerOperation(Tags = [SwaggerConstants.InsurancePlanTagSwagger])]
        [ProducesResponseType(typeof(InsurancePlanResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
        public async Task<ActionResult<InsurancePlanResult>> Update(Guid id, [FromBody] InsurancePlanCommand request)
        {
            var plan = await _repository.FirstOrDefaultAsync(new GetInsurancePlanByIdSpec(id));
            if (plan is null)
                throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(InsurancePlan)));

            _validator.ValidateRequiredForeignKeysAsync<InsurancePlan>(new()
            {
                { nameof(request.InsuranceCompanyId), request.InsuranceCompanyId }
            });

            await _validator.ValidateIsActiveAsync(request.InsuranceCompanyId, _companyRepository, nameof(InsuranceCompany));

            plan.UpdateInfo(request.Name, request.Description, request.IsActive);
            plan.InsuranceCompanyId = request.InsuranceCompanyId;

            await _repository.UpdateAsync(plan);
            await _repository.SaveChangesAsync();

            var result = new InsurancePlanResult(plan);
            return Ok(result);
        }
    }
}