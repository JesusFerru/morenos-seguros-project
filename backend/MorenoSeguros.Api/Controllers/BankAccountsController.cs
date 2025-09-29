using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Entities.PolicyAggregate;
using MorenoSeguros.Core.Entities.PolicyAggregate.Specification;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Net.Mime;

namespace MorenoSeguros.Api.Controllers
{
    [ApiController]
    [Route($"{RouteConstants.Route_V1}/[controller]")]
    [Produces(MediaTypeNames.Application.Json)]
    public class BankAccountsController : ControllerBase
    {
        private readonly IRepository<BankAccount> _repository;

        public BankAccountsController(IRepository<BankAccount> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [SwaggerOperation(Tags = [SwaggerConstants.BankAccountsTagSwagger])]
        [ProducesResponseType(typeof(List<BankAccountResult>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<List<BankAccountResult>>> GetAll()
        {
            var list = await _repository.ListAsync(new GetAllBankAccountsSpec());
            return Ok(list.Select(b => new BankAccountResult(b)).ToList());
        }

        [HttpGet("{id}")]
        [SwaggerOperation(Tags = [SwaggerConstants.BankAccountsTagSwagger])]
        [ProducesResponseType(typeof(BankAccountResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
        public async Task<ActionResult<BankAccountResult>> GetById(Guid id)
        {
            var bank = await _repository.FirstOrDefaultAsync(new GetBankAccountByIdSpec(id));
            if (bank is null)
                throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(BankAccount)));

            return Ok(new BankAccountResult(bank));
        }

        [HttpPost]
        [SwaggerOperation(Tags = [SwaggerConstants.BankAccountsTagSwagger])]
        [ProducesResponseType(typeof(BankAccountResult), (int)HttpStatusCode.Created)]
        public async Task<ActionResult<BankAccountResult>> Create([FromBody] BankAccountCommand request)
        {
            var bankAccount = new BankAccount
            {
                Bank = request.Bank,
                AccountType = request.AccountType,
                AccountNumber = request.AccountNumber,
                Currency = request.Currency,
                HolderName = request.HolderName
            };

            await _repository.AddAsync(bankAccount);
            await _repository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = bankAccount.Id }, new BankAccountResult(bankAccount));
        }

        [HttpPut("{id}")]
        [SwaggerOperation(Tags = [SwaggerConstants.BankAccountsTagSwagger])]
        [ProducesResponseType(typeof(BankAccountResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
        public async Task<ActionResult<BankAccountResult>> Update(Guid id, [FromBody] BankAccountCommand request)
        {
            var bank = await _repository.FirstOrDefaultAsync(new GetBankAccountByIdSpec(id));
            if (bank is null)
                throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(BankAccount)));

            bank.Bank = request.Bank;
            bank.AccountType = request.AccountType;
            bank.AccountNumber = request.AccountNumber;
            bank.Currency = request.Currency;
            bank.HolderName = request.HolderName;
            bank.IsActive = request.IsActive;

            await _repository.UpdateAsync(bank);
            await _repository.SaveChangesAsync();

            return Ok(new BankAccountResult(bank));
        }
    }

}
