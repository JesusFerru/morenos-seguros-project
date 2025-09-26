# ---------------------------
# build stage
# ---------------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiamos csproj por proyecto (mejora cache y evita el MSB1003)
COPY backend/MorenoSeguros.Api/MorenoSeguros.Api.csproj backend/MorenoSeguros.Api/
COPY backend/MorenoSeguros.Core/MorenoSeguros.Core.csproj backend/MorenoSeguros.Core/
COPY backend/MorenoSeguros.Infrastructure/MorenoSeguros.Infrastructure.csproj backend/MorenoSeguros.Infrastructure/

# Restaura usando el csproj del API (resolverá referencias a Core/Infra)
RUN dotnet restore backend/MorenoSeguros.Api/MorenoSeguros.Api.csproj

# Copia del resto del código
COPY backend ./backend

# Publica en Release
WORKDIR /src/backend/MorenoSeguros.Api
RUN dotnet publish -c Release -o /app/out --no-restore

# ---------------------------
# runtime stage
# ---------------------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/out ./

# .NET 8/9 usa 8080 por defecto dentro del contenedor
EXPOSE 8080

# Importante: PORT es dinámico en Railway. Usamos sh -c para expandirlo en runtime.
# Si Railway no provee PORT, cae por defecto a 8080.
CMD ["sh", "-c", "ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080} dotnet MorenoSeguros.Api.dll"]
