using Microsoft.EntityFrameworkCore;
using MorenoSeguros.Infrastructure.Data;

var builder = Host.CreateApplicationBuilder(args);

var configuration = builder.Configuration;

// Obtener cadena de conexión
var connectionString = configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string not found.");

// Agregar el DbContext de PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));


var host = builder.Build();

host.Run();