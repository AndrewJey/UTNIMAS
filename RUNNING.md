

<!-- local-development:start -->
# Desarrollo local

Puedes abrir este repositorio en VS Code, Antigravity o Sublime Text. El compilador y los servicios necesarios dependen del componente indicado abajo.

## Visual Studio 2022 / .NET Framework

Instala la carga de trabajo de escritorio .NET y el paquete de destino indicado en la tabla. Los proyectos ASP.NET también requieren la carga web e IIS Express. Abre la solución `.sln` correspondiente y selecciona el proyecto de aplicación para iniciar.

```powershell
# Ejecutar desde Developer PowerShell de Visual Studio 2022
$solutionDir = (Resolve-Path '.').Path + '\'
MSBuild.exe 'ADMIN_PORTAL/ADMIN_PORTAL.csproj' /restore /p:RestorePackagesConfig=true /p:Configuration=Debug /p:DeployOnBuild=false "/p:SolutionDir=$solutionDir"
```

## Bases de datos

Revisa los scripts de esquema y crea una base de datos de prueba separada. SSMS 20 y pgAdmin 4 son clientes; SQL Server y PostgreSQL son motores distintos. Los scripts SQL Server no se ejecutan directamente en PostgreSQL. Las restauraciones deben hacerse sobre una base de prueba nueva. PostgreSQL 17 y 18 requieren comprobarse por separado.

## Componentes y validación

Inventario y compilaciones locales del 2026-11-15. Una compilación correcta no acredita todavía interacción, compatibilidad de base de datos, instalador ni despliegue.

| Componente | Tipo / destino | Validación |
| --- | --- | --- |
| [ADMIN_PORTAL/ADMIN_PORTAL.csproj](<ADMIN_PORTAL/ADMIN_PORTAL.csproj>) | dotnet / v4.8.1 | Compila; prueba funcional pendiente |
| [UTNIMAS.sln](<UTNIMAS.sln>) | solution | Sin ejecutar |
| [UTNIMAS/UTNIMAS.csproj](<UTNIMAS/UTNIMAS.csproj>) | dotnet / v4.8.1 | Compila; prueba funcional pendiente |

## Archivos ignorados

`.gitignore` excluye credenciales locales, estado del editor y salidas de las herramientas detectadas. No deja de versionar archivos que ya estaban en Git. Los manifiestos, archivos de bloqueo, recursos fuente y scripts de esquema forman parte del código.
<!-- local-development:end -->

<!-- improvements-20261119:start -->
## Mejoras y verificación — 2026-11-19 (Eliminación de SQLi en EmpresasController y conexión configurable)

- Reemplazado el servidor fijo `DESKTOP-E38KCH7` en `ConexionBD.cs` por resolución configurable (`UTNIMAS_CONNECTION_STRING` -> `Web.config` -> `.\SQLEXPRESS`) e implementado `IDisposable`.
- Eliminada la inyección SQL en `EmpresasController.Create` (ahora usa Entity Framework `db.EMPRESAS.Add`), añadidas validaciones (`TryValidateEmpresa`) y respuestas seguras `400`/`404` ante IDs inválidos o registros inexistentes.
- Validación: compilación MSBuild (.NET Framework 4.8.1) y 8 aserciones automatizadas sobre `ConexionBD` y `EmpresasController`.
<!-- improvements-20261119:end -->
