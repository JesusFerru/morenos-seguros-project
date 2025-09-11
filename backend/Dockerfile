# ================================
# STAGE 1: Build
# ================================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar archivos de proyecto (.csproj) para restaurar dependencias
COPY backend/MorenoSeguros.Api/MorenoSeguros.Api.csproj backend/MorenoSeguros.Api/
COPY backend/MorenoSeguros.Infrastructure/MorenoSeguros.Infrastructure.csproj backend/MorenoSeguros.Infrastructure/
COPY backend/MorenoSeguros.Migration/MorenoSeguros.Migration.csproj backend/MorenoSeguros.Migration/

# Restaurar dependencias
WORKDIR /src/backend/MorenoSeguros.Api
RUN dotnet restore

# Copiar todo el código y compilar
COPY . .
RUN dotnet publish -c Release -o /app

# ================================
# STAGE 2: Runtime
# ================================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copiar build desde la etapa anterior
COPY --from=build /app .

# Configurar puerto para Railway
ENV ASPNETCORE_URLS=http://+:8080

# Iniciar aplicación
ENTRYPOINT ["dotnet", "MorenoSeguros.Api.dll"]
