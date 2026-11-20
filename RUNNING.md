

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
## Mejoras y verificación — 2026-11-19 (Compra/Venta, Carrusel, Tema Claro/Oscuro, Portal Admin y Persistencia)

### 1. Portal web interactivo instantáneo (`web-app/index.html`)
Se añadió una aplicación web standalone sin dependencias externas en [`web-app/index.html`](web-app/index.html) que reutiliza los logotipos e imágenes reales del proyecto (`UTNIMAS/Content/Images/`):
- **Carrusel de imágenes fluido:** autoplay con pausa al pasar el cursor/foco, navegación por flechas, teclado (`←`/`→`), gestos táctiles (*swipe*) e indicadores.
- **Tema Claro / Oscuro persistente:** botón en la barra superior sincronizado con `localStorage` (`utnimas_theme`), preferencia del sistema (`prefers-color-scheme`) y sincronización entre pestañas.
- **Catálogo de Compra / Venta:** búsqueda instantánea, filtros por sector IMAS y empresa registrada, ordenamiento por destacados/recientes/precio, lista de interés persistente y *lightbox* ampliable.
- **Contacto directo:** botones de WhatsApp, correo (`mailto:`), llamada (`tel:`), copia rápida de teléfono, barra flotante y formularios directos que alimentan la bandeja de consultas.
- **Área Administrativa para Empresas Registradas:** CRUD completo y persistente (`localStorage` + exportar/importar JSON + restaurar demo) para empresas, productos (con carga de imágenes *drag & drop*, compresión cliente en Canvas, vista previa inmediata, URL y opción *Destacar en carrusel*) y bandeja de mensajes.
- **Responsividad:** diseño adaptable de escritorio (`1280px+`) a móvil (`390px`) sin desbordamiento horizontal.

Para abrirlo de inmediato:
- Abrir directamente [`web-app/index.html`](web-app/index.html) en el navegador, o servir el repositorio localmente:
  ```powershell
  python -m http.server 8080 --directory .
  # Abrir http://127.0.0.1:8080/web-app/index.html
  ```
- Pruebas automatizadas de la capa de persistencia:
  ```powershell
  node --test web-app/tests/store.test.mjs
  ```

### 2. Mejoras en ASP.NET MVC 5 (`UTNIMAS/` y `ADMIN_PORTAL/`)
- **Conexión y respaldo sin BD:** `ConexionBD.cs` resuelve `UTNIMAS_CONNECTION_STRING` -> `Web.config` -> `.\SQLEXPRESS`, implementa `IDisposable` y añade `LocalCatalogFallback` para evitar pantallas vacías o caídas cuando SQL Server no está activo.
- **Seguridad y robustez:** eliminadas inyecciones SQL en `EmpresasController.Create` y `ProductosController.InsertarProducto` (consultas parametrizadas), validaciones seguras (`int.TryParse` / nulos) y respuestas controladas `400`/`404`.
- **UI/UX MVC:** botón de tema claro/oscuro persistente en `_Layout.cshtml` (`UTNIMAS` y `ADMIN_PORTAL`), carrusel hero en `Home/Index.cshtml`, modal con vista previa y botones de contacto (WhatsApp/Correo/Teléfono) en `Productos.cshtml`, zona *drag & drop* con preview de imagen en `RegistroProductos.cshtml`, corrección de `selected` duplicados en `RegistroEmpresas.cshtml` y vista de contacto institucional en `Home/Contact.cshtml`.

### 3. Validación ejecutada
- `MSBuild.exe` (.NET Framework 4.8.1): compilación limpia de `UTNIMAS.csproj` y `ADMIN_PORTAL.csproj`.
- Aserciones C# en tiempo de ejecución (9/9): resolución de conexión, fallback local de productos/empresas, `HomeController.Index`, `ProductosController.GetOnlyProducto` y `ObtenerInfo`.
- `node --check` (6/6 scripts JS) y `node --test web-app/tests/store.test.mjs` (4/4 pruebas de CRUD, filtros, links de contacto, validación segura de imágenes, exportación/importación JSON y persistencia).
- Verificación visual e interactiva en navegador real (escritorio `1280×800` y móvil `390×844`): 0 errores de consola/red, carrusel, persistencia de tema tras recarga, modal + lightbox, alta persistente de empresa y producto con vista previa de imagen y cero desbordamiento horizontal móvil.
<!-- improvements-20261119:end -->
