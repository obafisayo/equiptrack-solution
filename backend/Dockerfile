# Build:  docker build -t equiptrack-api backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY src/EquipTrack.Api/EquipTrack.Api.csproj src/EquipTrack.Api/
RUN dotnet restore src/EquipTrack.Api/EquipTrack.Api.csproj
COPY src/ src/
RUN dotnet publish src/EquipTrack.Api/EquipTrack.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
USER app
ENTRYPOINT ["dotnet", "EquipTrack.Api.dll"]
