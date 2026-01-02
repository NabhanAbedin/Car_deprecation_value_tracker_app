using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace CarDepreciationApi.controllers;

[ApiController]
[ApiExplorerSettings(IgnoreApi = true)]
public class ErrorController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    public ErrorController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }
    
    [Route("/error")]
    public IActionResult Error()
    {
        var context = HttpContext.Features.Get<IExceptionHandlerFeature>();
        var exception = context?.Error;

        return Problem(
            title: "An error occurred while processing your request",
            statusCode: 500,
            detail: _environment.IsDevelopment()
                ? exception?.Message 
                : null
        );
    }
}