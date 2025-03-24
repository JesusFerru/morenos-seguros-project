# Proyecto Moreno-Seguros

## Development API Route

https://localhost:7045/moreno-seguros/index.html

### Generate JWT:Secret 
Se generó un secret para cifrar los JWT con el siguiente comando en consola de PowerShell
Cuando se suba a producción se debe usar uno variable controlado por Azure y/o almacenado en Azure Vault Key u otro similar

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```