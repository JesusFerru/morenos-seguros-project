namespace MorenoSeguros.Api.Common;

public static class Constants
{
    public const string DotnetEnvironment = "DOTNET_ENVIRONMENT";
}
public static class SystemEnvironment
{
    public static bool IsDevelopment()
    {
        string? environment = Environment.GetEnvironmentVariable(Constants.DotnetEnvironment);
        return (environment != null && string.Equals(environment, Environments.Development, StringComparison.OrdinalIgnoreCase));
    }

    public static bool IsProduction()
    {
        string? environment = Environment.GetEnvironmentVariable(Constants.DotnetEnvironment);
        return (environment != null && string.Equals(environment, Environments.Production, StringComparison.OrdinalIgnoreCase));
    }

    public static string GetEnvironmentName()
    {
        return Environment.GetEnvironmentVariable(Constants.DotnetEnvironment)
            ?? throw new InvalidOperationException($"Environment variable '{Constants.DotnetEnvironment}' not found.");
    }

    public static class Environments
    {
        public static readonly string Development = "Development";
        public static readonly string Production = "Production";
    }
}