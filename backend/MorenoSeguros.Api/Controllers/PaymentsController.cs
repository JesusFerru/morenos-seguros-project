using Microsoft.AspNetCore.Mvc;
using MorenoSeguros.Core.Entities.PolicyAggregate;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System.Net.Mime;
using System.Net;
using MorenoSeguros.Core.Entities.PolicyAggregate.Specification;

namespace MorenoSeguros.Api.Controllers
{
    [ApiController]
    [Route($"{RouteConstants.Route_V1}/[controller]")]
    [Produces(MediaTypeNames.Application.Json)]
    public class PaymentsController : ControllerBase
    {
        private readonly IRepository<Payments> _repository;

        public PaymentsController(IRepository<Payments> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [SwaggerOperation(Tags = [SwaggerConstants.PaymentsTagSwagger])]
        [ProducesResponseType(typeof(List<PaymentsResult>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<List<PaymentsResult>>> GetAll()
        {
            var list = await _repository.ListAsync(new GetAllPaymentsSpec());
            return Ok(list.Select(p => new PaymentsResult(p)).ToList());
        }

        [HttpGet("{id}")]
        [SwaggerOperation(Tags = [SwaggerConstants.PaymentsTagSwagger])]
        [ProducesResponseType(typeof(PaymentsResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
        public async Task<ActionResult<PaymentsResult>> GetById(Guid id)
        {
            var payment = await _repository.FirstOrDefaultAsync(new GetPaymentByIdSpec(id));
            if (payment is null)
                throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(Payments)));

            return Ok(new PaymentsResult(payment));
        }

        [HttpPost]
        [SwaggerOperation(Tags = [SwaggerConstants.PaymentsTagSwagger])]
        [ProducesResponseType(typeof(PaymentsResult), (int)HttpStatusCode.Created)]
        public async Task<ActionResult<PaymentsResult>> Create([FromBody] PaymentsCommand request)
        {
            var payment = new Payments
            {
                PolicyNumber = request.PolicyNumber,
                PaymentDate = request.PaymentDate,
                Period = request.Period,
                PaymentMethod = request.PaymentMethod,
                Amount = request.Amount,
                ReceiptUrl = request.ReceiptUrl
            };

            await _repository.AddAsync(payment);
            await _repository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = payment.Id }, new PaymentsResult(payment));
        }

        [HttpPut("{id}")]
        [SwaggerOperation(Tags = [SwaggerConstants.PaymentsTagSwagger])]
        [ProducesResponseType(typeof(PaymentsResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.NotFound)]
        public async Task<ActionResult<PaymentsResult>> Update(Guid id, [FromBody] PaymentsCommand request)
        {
            var payment = await _repository.FirstOrDefaultAsync(new GetPaymentByIdSpec(id));
            if (payment is null)
                throw new NotFoundException(ErrorMessages.GetMessage(nameof(NotFoundException), nameof(Payments)));

            payment.PolicyNumber = request.PolicyNumber;
            payment.PaymentDate = request.PaymentDate;
            payment.Period = request.Period;
            payment.PaymentMethod = request.PaymentMethod;
            payment.Amount = request.Amount;
            payment.ReceiptUrl = request.ReceiptUrl;

            await _repository.UpdateAsync(payment);
            await _repository.SaveChangesAsync();

            return Ok(new PaymentsResult(payment));
        }
    }

}
