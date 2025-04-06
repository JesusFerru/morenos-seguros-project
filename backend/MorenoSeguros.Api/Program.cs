using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MorenoSeguros.Api.Common;
using MorenoSeguros.Api.Middleware;
using MorenoSeguros.Infrastructure;
using MorenoSeguros.Migration;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

#region Service Configuration

// Add Aspire service defaults .
builder.AddServiceDefaults();

// Add Swagger generation for API documentation.


builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddProblemDetails(option =>
{
    option.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Instance = $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}";
        context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier;
    };
});
builder.Services.AddExceptionHandler<HandleException>();

// Enable endpoint API explorer for Swagger/OpenAPI documentation.
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddControllers();

string landingPageDomain = string.Empty;
if (SystemEnvironment.IsDevelopment())
{
    landingPageDomain = "http://localhost:4200";

}
else if (SystemEnvironment.IsProduction())
{
    landingPageDomain = "https://moreno-seguros.com";
}

//if (string.IsNullOrEmpty(landingPageDomain))
//{
//    throw new ArgumentException("Landing page domain can't be null");
//}

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost4200",
        builder => builder
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

using var loggerFactory = LoggerFactory.Create(b => b.SetMinimumLevel(LogLevel.Error).AddConsole());

var secret = builder.Configuration["JWT:Secret"] ?? throw new InvalidOperationException("Secret not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
    };
    options.Events = new JwtBearerEvents
    {
        OnChallenge = ctx => LogAttempt(ctx.Request.Headers, "OnChallenge"),
        OnTokenValidated = ctx => LogAttempt(ctx.Request.Headers, "OnTokenValidated")
    };
});

builder.Services.AddAuthorization();


#endregion

#region Swagger Configuration

var securitySchema = new OpenApiSecurityScheme
{
    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
    Name = "Authorization",
    In = ParameterLocation.Header,
    Type = SecuritySchemeType.Http,
    Scheme = "bearer",
    Reference = new OpenApiReference
    {
        Type = ReferenceType.SecurityScheme,
        Id = "Bearer"
    }
};

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Moreno Seguros API",
        Description = "Services Moreno Seguros",
        TermsOfService = new Uri("https://example.com/terms"),
        Contact = new OpenApiContact
        {
            Name = "Moreno Seguros",
            Url = new Uri("https://example.com/contact")
        },
        License = new OpenApiLicense
        {
            Name = "Moreno Seguros",
            Url = new Uri("https://example.com/license")
        }
    });

    options.AddSecurityDefinition("Bearer", securitySchema);

    var securityRequirement = new OpenApiSecurityRequirement
                {
                    { securitySchema, new[] { "Bearer" } }
                };

    options.AddSecurityRequirement(securityRequirement);
    options.EnableAnnotations();
});
#endregion

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();
app.UseHttpLogging();
app.UseExceptionHandler();
app.UseCors("AllowLocalhost4200");

// Configure the HTTP request pipeline.
//if (!app.Environment.IsDevelopment())
//{
//    app.UseExceptionHandler("/Error");
//    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
//    app.UseHsts();
//}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.RoutePrefix = "moreno-seguros";
    c.DocumentTitle = "Moreno Seguros API";
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Moreno-Seguros API V1");
});


// Map default endpoints provided by your application.
#region Endpoint Registration

app.MapDefaultControllerRoute();
app.MapDefaultEndpoints();

app.MapControllers();
#endregion

app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();


app.Run();


Task LogAttempt(IHeaderDictionary headers, string eventType)
{
    var logger = loggerFactory.CreateLogger<Program>();

    var authorizationHeader = headers.Authorization.FirstOrDefault();

    if (authorizationHeader is null)
        logger.LogInformation($"{eventType}. JWT not present");
    else
    {
        string jwtString = authorizationHeader["Bearer ".Length..];

        var jwt = new JwtSecurityToken(jwtString);

        logger.LogInformation($"{eventType}. Expiration: {jwt.ValidTo.ToLongTimeString()}. System time: {DateTime.UtcNow.ToLongTimeString()}");
    }

    return Task.CompletedTask;
}