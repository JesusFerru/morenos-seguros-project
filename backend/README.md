# Proyecto Moreno-Seguros

## Development API Route

https://localhost:7045/moreno-seguros/index.html

### Generate JWT:Secret 
Se generó un secret para cifrar los JWT con el siguiente comando en consola de PowerShell
Cuando se suba a producción se debe usar uno variable controlado por Azure y/o almacenado en Azure Vault Key u otro similar

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Create New Migration
```
dotnet ef --startup-project ..\MorenoSeguros.Api\ -v migrations add "Update_Dni_User_Table"
```
### Update Db migrations
```
dotnet ef --startup-project ../MorenoSeguros.Migration migrations add UpdateDateColumnFromDateTimeToDateOnly

```

### Ejemplo Store User 
Para role solo esta permitido "Admin" o "Collaborator", por el momento
```json
{
  "firstName": "Luis",
  "lastName": "Ferrufino",
  "ci": "12345",
  "phoneNumber": "70000000",
  "username": "lferrufino",
  "email": "easyway.scz@gmail.com",
  "password": "Pirata123",
  "role": "Admin"
}
```