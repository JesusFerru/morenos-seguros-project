using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using MorenoSeguros.Core.Exceptions;

namespace MorenoSeguros.Api.Middleware;

public class HandleException : IExceptionHandler
{
    private readonly IProblemDetailsService _problemDetailsService;

    public HandleException(IProblemDetailsService problemDetailsService)
    {
        _problemDetailsService = problemDetailsService;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        int statusCode = exception switch
        {
            BadRequestException => StatusCodes.Status400BadRequest,
            UnauthorizedException => StatusCodes.Status401Unauthorized,
            ForbiddenException => StatusCodes.Status403Forbidden,
            NotFoundException => StatusCodes.Status404NotFound,
            TimeoutException => StatusCodes.Status408RequestTimeout,
            ConflictException => StatusCodes.Status409Conflict,
            UnsupportedContentTypeException => StatusCodes.Status415UnsupportedMediaType,
            _ => StatusCodes.Status500InternalServerError
        };

        var problemDetails = new ProblemDetails
        {
            Detail = exception.Message,
            Status = statusCode,
            Type = exception.GetType().Name,
            Title = "Exception",
            Instance = $"{httpContext.Request.Method} {httpContext.Request.Path}" // Agrega más contexto al error
        };

        httpContext.Response.StatusCode = statusCode;
        await _problemDetailsService.WriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = problemDetails
        });

        return true;
    }
}
