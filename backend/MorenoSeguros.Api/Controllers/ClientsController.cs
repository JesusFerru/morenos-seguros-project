using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Entities.ClientAggregate;
using MorenoSeguros.Core.Entities.ClientAggregate.Specfication;
using MorenoSeguros.Core.Entities.ClientAggregate.ValueObjects;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.Interfaces;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Net.Mime;

namespace MorenoSeguros.Api.Controllers;

[Route($"{RouteConstants.Route_V1}/[controller]")]
[ApiController]
[Produces(MediaTypeNames.Application.Json)]
public class ClientsController : ControllerBase
{
    private readonly IRepository<Clients> _repository;
    private readonly IEntityStateValidatorService _validator;

    public ClientsController(IRepository<Clients> repository, IEntityStateValidatorService validator)
    {
        _repository = repository;
        _validator = validator;
    }

    [HttpGet]
    [SwaggerOperation(Tags = [SwaggerConstants.ClientsTagSwagger])]
    [ProducesResponseType(typeof(List<ClientsResult>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<ClientsResult>>> GetAll()
    {
        var clients = await _repository.ListAsync(new GetAllClientsSpec());
        return Ok(clients.Select(c => new ClientsResult(c)).ToList());
    }

    [HttpGet("active")]
    [SwaggerOperation(Tags = [SwaggerConstants.ClientsTagSwagger])]
    [ProducesResponseType(typeof(List<ClientsResult>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<ClientsResult>>> GetActive()
    {
        var clients = await _repository.ListAsync(new GetActiveClientsSpec());
        return Ok(clients.Select(c => new ClientsResult(c)).ToList());
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Tags = [SwaggerConstants.ClientsTagSwagger])]
    [ProducesResponseType(typeof(ClientsResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<ClientsResult>> GetById(Guid id)
    {
        var client = await _repository.FirstOrDefaultAsync(new GetClientsByIdSpec(id))
                     ?? throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(Clients)));

        return Ok(new ClientsResult(client));
    }

    [HttpPost]
    [SwaggerOperation(Tags = [SwaggerConstants.ClientsTagSwagger])]
    [ProducesResponseType(typeof(ClientsResult), (int)HttpStatusCode.Created)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.Conflict)]
    public async Task<ActionResult<ClientsResult>> Create([FromBody] ClientsCommand request)
    {
        var client = new Clients
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            DocumentType = DocumentType.FromName(request.DocumentType),
            DocumentNumber = request.DocumentNumber,
            BirthDate = request.BirthDate,
            Nit = request.Nit,
            BusinessName = request.BusinessName,
            Email = request.Email,
            City = request.City,
            Address = request.Address,
            EmploymentStatus = request.EmploymentStatus,
            FundOrigin = request.FundOrigin,
            IncomeRange = request.IncomeRange
        };

        await _repository.AddAsync(client);
        await _repository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = client.Id }, new ClientsResult(client));
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Tags = [SwaggerConstants.ClientsTagSwagger])]
    [ProducesResponseType(typeof(ClientsResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<ClientsResult>> Update(Guid id, [FromBody] ClientsCommand request)
    {
        var client = await _repository.FirstOrDefaultAsync(new GetClientsByIdSpec(id))
                     ?? throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(Clients)));

        client.FirstName = request.FirstName;
        client.LastName = request.LastName;
        client.PhoneNumber = request.PhoneNumber;
        client.DocumentType = DocumentType.FromName(request.DocumentType);
        client.DocumentNumber = request.DocumentNumber;
        client.BirthDate = request.BirthDate;
        client.Nit = request.Nit;
        client.BusinessName = request.BusinessName;
        client.Email = request.Email;
        client.City = request.City;
        client.Address = request.Address;
        client.EmploymentStatus = request.EmploymentStatus;
        client.FundOrigin = request.FundOrigin;
        client.IncomeRange = request.IncomeRange;
        client.IsActive = request.IsActive;

        await _repository.UpdateAsync(client);
        await _repository.SaveChangesAsync();

        return Ok(new ClientsResult(client));
    }
}
