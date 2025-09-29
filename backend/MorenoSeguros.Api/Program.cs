using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MorenoSeguros.Api.Middleware;
using MorenoSeguros.Infrastructure;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Solo forzar puerto 8080 en producción (Railway)
if (builder.Environment.IsProduction())
{
    var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
    builder.WebHost.ConfigureKestrel(options =>
    {
        options.ListenAnyIP(int.Parse(port));
    });
}

// ------------------------
// Service Configuration
// ------------------------
builder.Services.AddInfrastructureServices(builder.Configuration);

// Problem details + custom handler
builder.Services.AddProblemDetails(option =>
{
    option.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Instance = $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}";
        context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier;
    };
});
builder.Services.AddExceptionHandler<HandleException>();

builder.Services.AddHttpLogging(logging =>
{
    logging.LoggingFields = Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.All;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();

// ------------------------
// CORS config (dynamic from env)
// ------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "frontend_clauses",
        policy =>
        {
            policy
                .WithOrigins("https://morenoseguros.up.railway.app")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// ------------------------
// JWT Authentication
// ------------------------
var secret = builder.Configuration["JWT:Secret"]
             ?? Environment.GetEnvironmentVariable("JWT__Secret")
             ?? throw new InvalidOperationException("JWT Secret not configured");

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
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"] ?? Environment.GetEnvironmentVariable("JWT__ValidIssuer"),
        ValidAudience = builder.Configuration["JWT:ValidAudience"] ?? Environment.GetEnvironmentVariable("JWT__ValidAudience"),
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
    };
    options.Events = new JwtBearerEvents
    {
        OnChallenge = ctx => LogAttempt(ctx.Request.Headers, "OnChallenge"),
        OnTokenValidated = ctx => LogAttempt(ctx.Request.Headers, "OnTokenValidated")
    };
});

builder.Services.AddAuthorization();

// ------------------------
// Swagger Configuration
// ------------------------
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
        Description = "Services Moreno Seguros"
    });

    options.AddSecurityDefinition("Bearer", securitySchema);

    var securityRequirement = new OpenApiSecurityRequirement
    {
        { securitySchema, new[] { "Bearer" } }
    };

    options.AddSecurityRequirement(securityRequirement);
    options.EnableAnnotations();
});

// ------------------------
// Build app
// ------------------------
var app = builder.Build();

app.UseHttpLogging();
app.UseExceptionHandler();

app.UseCors("frontend_clauses");

// Swagger always enabled (can limit to Dev if needed)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.RoutePrefix = "moreno-seguros";
    c.DocumentTitle = "Moreno Seguros API";
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Moreno-Seguros API V1");
});

// Avoid HTTPS redirection on Railway (proxy already handles TLS)
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapDefaultControllerRoute();
app.MapControllers();

// Serve static assets (if you later copy Angular build here)
app.MapStaticAssets();

app.Run();

// ------------------------
// Helper: JWT log attempts
// ------------------------
Task LogAttempt(IHeaderDictionary headers, string eventType)
{
    using var loggerFactory = LoggerFactory.Create(b => b.SetMinimumLevel(LogLevel.Information).AddConsole());
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
