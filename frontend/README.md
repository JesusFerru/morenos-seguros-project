## Tso Plus Web APP
Frontend del sistema de gestión para TSO Plus

## Estructura del Proyecto
El proyecto está organizado en tres módulos principales dentro del directorio app:

`Home` Proporciona un dashboard interactivo para una visión general rápida de la actividad principal y métricas.

`Login` Maneja la autenticación de usuarios, permitiendo el acceso seguro a la plataforma.

`Payment Plans` Administra la visualización y gestión de planes de pago, facilitando operaciones financieras.

## Preparacion del entorno de desarrollo
Este proyecto requiere [Node.js](https://nodejs.org/en) y Angular CLI para ejecutarse.

### Instalación de herramientas globales

Instalar Angular CLI para gestionar el proyecto:
```bash
npm install -g @angular/cli
```

Instalar las dependencias del proyecto, dirigirte a la raiz del directorio donde se encuentra packages.json
```bash
npm install
```

## Ejecutar el proyecto 

Para ejecutar el proyecto coloca el siguiente comando desde la raiz del proyecto
```bash
npm start
```
Navega a http://localhost:4200/ para ver la aplicación en ejecución.

## Conexión con el Backend

En tso-plus-web-app\src\environments puedes cambiar el valor de apiBaseUrl en caso de que estes trabajando de forma local el backend.

Localmente esta apuntanto a mi ip local

## Arquitectura

Carpeta @Fuse No se Toca NADA!

    * Carpeta Shared : Donde iran todo los servicios,componente o utils entre los diferentes modules de la carpeta Main.
        
        *Pueden ser componente que se repitan como ser Un TableComponent o Un ViewHeader. Cualquier html vea que es      igual a otro en diferentes modulos llevarlo a un componente Generico y a Shared.

        *Estructuracion 3 Carpetas : domain-infrastructure-presentation: La estructuracion se explica mas abajo asi que Tranquilo Causa.

        *Se encuentra los helper,interceptor para las injecciones de Token y helper donde los guards y httpService Generico

    * Main/Feature : Todo los modulos de presentation de las paginas integradas con el backend.

    * Assets : Donde se guardara todo los logos,iconos,fonts y styles. Si desea nuevos iconos los agrega a los "heroicons" copia el svg donde lo encontro y pone su id Propio Unico Representativo.

## Estructuracion de Carpetas

    *Infrastructure : Donde se encuentra los servicios,modelos y tambien los pipeline o cualquier logica que puede ser usada en TypeScrypt.

    *Presentation : Donde Solamente estara el HTML de cada pagina y su llamada de modelos y servicios de la carpeta Infrastructure donde la logica de onTouch o onCHange estara en el component.ts del Html.

    *Router : Si Enrutador de cada Modulo de la carpeta Main Donde se define las rutas de cada modulo y sus componentes.

    *Domain (Only Shared) : Donde se encontraran los pipe,directives,constants,enums Compartidos entre diferentes Modulos.

## Nota del Desarrollador

* Se Solicita no usar mucho el "any" es decir un modelo "any" ejemplo :
    *var resultServices : any
Se recomienda siempre crear su modelo

* Se recomienda np usar los .scss de los html, Todo diseño es con angular material y TailwindsCss y Fue Angular : 
https://angular-material.fusetheme.com/dashboards/project Puede revisar ahi los componentes Fuse. Si quiere ver los componentes Fuse Dejare la Demo aqui : https://1drv.ms/u/s!AgWphe3eJuPohFtkqnm6koza0Bc2?e=IgwOzR Donde se encuentra, Se descarga un npm isntall y buscar el componente que desea. Pddt Usar el Demo

## Generacion Container Azure Static Web App (Devops)

Loguear en la suscripcion

az account set --subscription 'bb48aedc-441a-4615-94dd-2f1d108e5649'

az deployment group create --template-file ./biceps/main.bicep --resource-group Tso-Plus --parameters projectCode=tso-web