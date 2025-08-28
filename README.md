# NetScanner CLI

NetScanner CLI es una herramienta de línea de comandos desarrollada en Node.js para el diagnóstico de redes y la recopilación de información. Proporciona una amplia gama de funcionalidades para administradores de red, profesionales de la seguridad y desarrolladores.

## Características

- **Escaneo de Puertos:** Escanea puertos abiertos, cerrados o filtrados en un host de destino.
- **Búsquedas de DNS:** Realiza varias consultas de DNS, incluidos los registros A, MX, NS, CNAME, TXT, SPF, DKIM y DMARC.
- **Información de Red:** Obtiene información detallada sobre una dirección IP o dominio (IPinfo, WHOIS).
- **Solución de Problemas de Red:** Hace ping a los hosts para comprobar la conectividad.
- **Inspección de Certificados SSL:** Recupera detalles sobre el certificado SSL de un dominio.
- **Y más...**

## Estructura del Proyecto

El proyecto está organizado en los siguientes directorios:

-   `src/`: Contiene todo el código fuente.
    -   `commands/`: Cada archivo en este directorio representa un comando de la CLI. La lógica de cada comando está encapsulada aquí.
    -   `services/`: Contiene la lógica de negocio principal de la aplicación. Por ejemplo, `portScannerService.js` contiene la lógica para escanear puertos.
    -   `clients/`: Contiene clientes para interactuar con APIs externas (por ejemplo, DNS, IPinfo, WHOIS).
    -   `config/`: Contiene archivos de configuración para la aplicación (por ejemplo, puertos predeterminados, tiempos de espera, listas de comandos).
    -   `utils/`: Contiene funciones de utilidad utilizadas en toda la aplicación (por ejemplo, comandos del sistema, registro, tablas).
-   `CHANGELOG.md`: Un registro de todos los cambios realizados en el proyecto.
-   `README.md`: Este archivo de documentación.
-   `netScanner.js`: El punto de entrada principal de la aplicación. Carga los comandos e inicia la CLI.

## Comandos

La aplicación proporciona los siguientes comandos:

| Comando       | Descripción                                               |
|---------------|-----------------------------------------------------------|
| `help`        | Muestra la lista de comandos disponibles.                  |
| `exit`        | Sale de la aplicación.                                    |
| `clear`       | Limpia la pantalla de la terminal.                               |
| `portscan`    | Escanea los puertos de una IP o dominio.                      |
| `ipinfo`      | Obtiene información sobre una IP o dominio de ipinfo.io.    |
| `provdns`     | Elige un proveedor de DNS.                                   |
| `checkdns`    | Comprueba si un servidor DNS está activo.                         |
| `ping`        | Hace ping a un host.                                            |
| `serialssl`   | Verifica un certificado SSL por su número de serie.         |
| `infos`       | Obtiene información del servidor.                                  |
| `mx`          | Realiza una búsqueda de registros MX.                             |
| `ns`          | Realiza una búsqueda de registros NS.                             |
| `a`           | Realiza una búsqueda de registros A.                              |
| `txt`         | Realiza una búsqueda de registros TXT.                            |
| `cname`       | Realiza una búsqueda de registros CNAME.                          |
| `ptr`         | Realiza una búsqueda de registros PTR.                            |
| `spf`         | Realiza una búsqueda de registros SPF.                            |
| `dkim`        | Realiza una búsqueda de registros DKIM.                           |
| `dmarc`       | Realiza una búsqueda de registros DMARC.                          |
| `whois`       | Realiza una búsqueda WHOIS.                               |
| `blacklist`   | Comprueba si una IP está en una lista negra.                        |
| `banner`      | Obtiene el banner de un servicio.                           |
| `ssl`         | Obtiene información del certificado SSL.                         |
| `ipwavenet`   | Comprueba si una IP pertenece a Wavenet.                       |
| `ipadm`       | Enumera los rangos de IP de Wavenet.                                |
| `ip`          | Obtiene la dirección IP de un dominio.                          |

## Cómo ejecutar la aplicación

Para ejecutar la aplicación, necesitas tener Node.js instalado. Luego, desde el directorio raíz del proyecto, ejecuta:

```bash
node netScanner.js
```

Esto iniciará la interfaz de línea de comandos interactiva.

## Desarrollo Futuro

Para continuar mejorando el proyecto, se recomiendan los siguientes pasos:

-   **Añadir un Conjunto de Pruebas:** Implementar pruebas unitarias y de integración para los comandos y servicios para garantizar la fiabilidad y evitar regresiones.
-   **Mejorar la Validación de Entradas:** Implementar una validación de entradas robusta para todos los comandos para evitar errores y proporcionar una mejor retroalimentación al usuario. Se recomienda una biblioteca como `validator.js`.
-   **Añadir Nuevos Comandos:** Gracias a la nueva estructura modular, añadir nuevos comandos es tan simple como crear un nuevo archivo en el directorio `src/commands`. El nuevo comando se cargará automáticamente.
