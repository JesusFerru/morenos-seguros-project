using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;
namespace MorenoSeguros.Migration
{
    public static class ServiceDefaultsExtensions
    {
        // Método principal para agregar configuraciones básicas
        public static TBuilder AddServiceDefaults<TBuilder>(this TBuilder builder) where TBuilder : IHostApplicationBuilder
        {
            builder.ConfigureOpenTelemetry();
            builder.AddDefaultHealthChecks();

            // Agrega HttpLogging si lo consideras necesario
            builder.Services.AddHttpLogging(logging =>
            {
                logging.LoggingFields = HttpLoggingFields.All;
            });

            return builder;
        }

        public static TBuilder ConfigureOpenTelemetry<TBuilder>(this TBuilder builder) where TBuilder : IHostApplicationBuilder
        {
            // Configuración básica para OpenTelemetry
            builder.Logging.AddOpenTelemetry(logging =>
            {
                logging.IncludeFormattedMessage = true;
                logging.IncludeScopes = true;
            });

            builder.Services.AddOpenTelemetry()
                .WithMetrics(metrics =>
                {
                    metrics.AddAspNetCoreInstrumentation()
                           .AddHttpClientInstrumentation()
                           .AddRuntimeInstrumentation();
                })
                .WithTracing(tracing =>
                {
                    tracing.AddSource(builder.Environment.ApplicationName)
                           .AddAspNetCoreInstrumentation()
                           .AddHttpClientInstrumentation();
                });

            // Puedes agregar exportadores básicos aquí si los necesitas (por ejemplo, OTLP o Azure Monitor)
            // builder.Services.AddOpenTelemetry().UseOtlpExporter();
            // builder.Services.AddOpenTelemetry().UseAzureMonitor();

            return builder;
        }

        public static TBuilder AddDefaultHealthChecks<TBuilder>(this TBuilder builder) where TBuilder : IHostApplicationBuilder
        {
            builder.Services.AddHealthChecks()
                .AddCheck("self", () => HealthCheckResult.Healthy(), new[] { "live" });
            return builder;
        }

        public static WebApplication MapDefaultEndpoints(this WebApplication app)
        {
            app.MapHealthChecks("/health");
            app.MapHealthChecks("/alive", new HealthCheckOptions
            {
                Predicate = r => r.Tags.Contains("live")
            });
            return app;
        }
    }
}
