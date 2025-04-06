using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Api.Dtos;
using MorenoSeguros.Core.Entities.CompanyAggregate;
using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate.Specification;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using static MorenoSeguros.Core.SharedKernel.Constants.ErrorMessages;

namespace MorenoSeguros.Api.Controllers
{
    [Route($"{RouteConstants.Route_V1}/[controller]")]
    [ApiController]
    public class InsuranceCompaniesController : ControllerBase
    {
        private readonly IRepository<InsuranceCompany> _repository;

        public InsuranceCompaniesController(IRepository<InsuranceCompany> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [SwaggerOperation(Tags = [SwaggerConstants.InsuranceCompanyTagSwagger])]
        [ProducesResponseType(typeof(List<InsuranceCompanyResult>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<List<InsuranceCompanyResult>>> GetAll()
        {
            var companies = await _repository.ListAsync(new GetAllInsuranceCompaniesSpec());
            var result = companies.Select(c => new InsuranceCompanyResult(c)).ToList();
            return Ok(result);
        }

        [HttpGet("active")]
        [SwaggerOperation(Tags = [SwaggerConstants.InsuranceCompanyTagSwagger])]
        [ProducesResponseType(typeof(List<InsuranceCompanyResult>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<List<InsuranceCompanyResult>>> GetActive()
        {
            var companies = await _repository.ListAsync(new GetActiveInsuranceCompaniesSpec());
            var result = companies.Select(c => new InsuranceCompanyResult(c)).ToList();
            return Ok(result);
        }

        [HttpGet("{id}")]
        [SwaggerOperation(Tags = [SwaggerConstants.InsuranceCompanyTagSwagger])]
        [ProducesResponseType(typeof(InsuranceCompanyResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
        public async Task<ActionResult<InsuranceCompanyResult>> GetById(Guid id)
        {
            var company = await _repository.FirstOrDefaultAsync(new GetInsuranceCompanyByIdSpec(id)) ??
                throw new NotFoundException(GetMessage(nameof(NotFoundException), nameof(InsuranceCompany)));

            var result = new InsuranceCompanyResult(company);
            return Ok(result);
        }

        [HttpPost]
        [SwaggerOperation(Tags = [SwaggerConstants.InsuranceCompanyTagSwagger])]
        [ProducesResponseType(typeof(InsuranceCompanyResult), (int)HttpStatusCode.Created)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.Conflict)]
        public async Task<ActionResult<InsuranceCompanyResult>> Create([FromBody] InsuranceCompanyCommand request)
        {
            var existing = await _repository.ListAsync();
            if (existing.Any(e => e.Name == request.Name))
                throw new ConflictException(GetMessage(ConflictErrorCode.ResourceAlreadyExists.ToString(), nameof(InsuranceCompany)));

            var company = new InsuranceCompany(request.Name, request.Description, request.LogoUrl, request.WebsiteUrl);
            await _repository.AddAsync(company);
            await _repository.SaveChangesAsync();

            var result = new InsuranceCompanyResult(company);
            return CreatedAtAction(nameof(GetById), new { id = company.Id }, result);
        }

        [HttpPut("{id}")]
        [SwaggerOperation(Tags = [SwaggerConstants.InsuranceCompanyTagSwagger])]
        [ProducesResponseType(typeof(InsuranceCompanyResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
        public async Task<ActionResult<InsuranceCompanyResult>> Update(Guid id, [FromBody] InsuranceCompanyCommand request)
        {
            var company = await _repository.FirstOrDefaultAsync(new GetInsuranceCompanyByIdSpec(id));
            if (company is null)
                throw new NotFoundException(GetMessage(nameof(NotFoundException), nameof(InsuranceCompany)));

            company.UpdateInfo(request.Name, request.Description, request.LogoUrl, request.WebsiteUrl, request.IsActive);
            await _repository.UpdateAsync(company);
            await _repository.SaveChangesAsync();

            var result = new InsuranceCompanyResult(company);
            return Ok(result);
        }
    }
}

