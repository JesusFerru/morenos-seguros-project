# ================================
# STAGE 1: Build (SDK 9.0)
# ================================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copia csproj de cada proyecto
COPY MorenoSeguros.Api/MorenoSeguros.Api.csproj MorenoSeguros.Api/
COPY MorenoSeguros.Infrastructure/MorenoSeguros.Infrastructure.csproj MorenoSeguros.Infrastructure/
COPY MorenoSeguros.Core/MorenoSeguros.Core.csproj MorenoSeguros.Core/
# Si tienes Migration, agrega también:
# COPY MorenoSeguros.Migration/MorenoSeguros.Migration.csproj MorenoSeguros.Migration/

# Restaura dependencias desde la carpeta del Api
WORKDIR /src/MorenoSeguros.Api
RUN dotnet restore

# Copia todo el código fuente y publica en Release
COPY . .
RUN dotnet publish "MorenoSeguros.Api/MorenoSeguros.Api.csproj" -c Release -o /app

# ================================
# STAGE 2: Runtime (ASP.NET 9.0)
# ================================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app .

# Railway escucha en 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "MorenoSeguros.Api.dll"]
