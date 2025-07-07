const path = require("path"); 
const {knownPortsServices}= require("../config/portsConfig.js");
const { consoleControl, consoleStyles } = require("../utils/systemCommands.js");
const { setDNSProvider } = require("../src/clients/api/DNSClient.js");




// Configurciones iniciales



const logFileName= "scan-log.txt";
const logFilePath= path.join(process.cwd(), "scan-log.txt"); //crea la ruta completa al archivo scan-log.txt en el mismo lugar desde donde ejecutás el programa
let logLines=[]; // Array para almacenar los resultados
const defaultTimeout= 4000;
const defaultPorts = knownPortsServices.map(service => service.port);

const companyName = "Wavenet";
const companyNameLower = companyName.toLowerCase();




const listCommands = `
ℹ️ ${consoleStyles.text.green} COMANDOS DISPONIBLES:  ${consoleControl.resetStyle}

--------------------------------------------------------------------------------------
  help        Muestra esta lista de comandos.
--------------------------------------------------------------------------------------
  exit        Sale de la aplicación.
--------------------------------------------------------------------------------------
  clear       Limpia la pantalla de la terminal.
--------------------------------------------------------------------------------------
  ping        Verifica si el host (IP o dominio) está accesible desde tu red. 
              Usa paquetes ICMP para probar conectividad.
              ${consoleStyles.text.gray}Dominio o IP ➔ Respuesta de ping${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ip          Resuelve el dominio a su dirección IP.
             ${consoleStyles.text.gray} Dominio ➜ IP (lookup DNS) ${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ip${companyNameLower}    Verifica si una IP esta administrado por ${companyName}.
               ${consoleStyles.text.gray}IP ➜ ${companyName} - IP administrada${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ipadm       Muestra una lista con todos los rangos de IP administrados por ${companyName}.
--------------------------------------------------------------------------------------
  ipinfo      Muestra información detallada de la IP o dominio:
              ISP, ubicación, ASN, etc. (via ipinfo.io)
              ${consoleStyles.text.gray}Dominio o IP ➔ Información${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  whois       Realiza una consulta WHOIS para obtener información del dominio o IP.
              Incluye datos de registro, propietario, fechas, etc.
              ${consoleStyles.text.gray}Dominio o IP ➔ Información WHOIS${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  infos       Escanea la información del servidor
              (panel de control, sistema operativo, etc.)
              ${consoleStyles.text.gray}Dominio o IP ➔ Información del servidor${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ptr         Realiza una búsqueda inversa de IP y devuelve el 
              nombre de dominio asociado.
              ${consoleStyles.text.gray}IP ➜ Dominio - registro PTR${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  a           Muestra los registros A de un dominio. Indica la dirección IPv4 a la que 
              resuelve ese nombre de dominio o subdominio. Indica registro A 
              asocia un nombre de dominio o subdominio con una dirección IPv4.
              ${consoleStyles.text.gray}Dominio ➔ IP - Registro A${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  mx          Muestra los registros MX de un dominio y rastrea a donde apunta 
              (incluido PTR para rastreo profundo).
              ${consoleStyles.text.gray}Dominio ➔ Servidores de correo - Registro MX${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ns          Muestra los registros NS. Especifica servidores de nombres autorizados
              (Servidores DNS autoritativos)para el dominio Indica quien gestiona los servidores DNS
              autoritativos del dominio.
              ${consoleStyles.text.gray}Dominio ➔ Servidores de nombres - Registro NS${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  cname       Verifica si el dominio tiene un alias CNAME.
              ${consoleStyles.text.gray}CNAME ➜ Otro dominio - Registro CNAME${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  txt         Muestra los registros TXT del dominio. Incluye SPF, DKIM, 
              verificación Google, etc.
              ${consoleStyles.text.gray}Dominio ➔ TXT - Registro TXT${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  spf         Muestra los registros SPF del dominio (Este escrito en TXT). 
              Devuelve una lista de servidores de correo o rutas indirectas hacia 
              ellos que están autorizados a enviar emails en su nombre.
              ${consoleStyles.text.gray}Dominio ➔ SPF - Registro SPF${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  dkim        Muestra el registro DKIM del dominio.
              Usa claves criptográficas para autenticar que un correo electrónico fue 
              enviado y autorizado por el dueño del dominio, 
              y que no fue modificado en tránsito.  
              Protocolo para autenticar correos usando firmas digitales.
              ${consoleStyles.text.gray}Dominio ➔ DKIM - Registro DKIM${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  dmarc       Muestra el registro DMARC del dominio.
              Política de autenticación y reporte para correos.
              Permite que un dominio especifique a los servidores de correo receptores 
              cómo manejar los correos que parecen venir de su dominio, pero que no 
              pasan ciertas verificaciones de autenticidad (como SPF y DKIM)
              ${consoleStyles.text.gray}Dominio ➔ DMARC - Registro DMARC${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ssl         Verifica el certificado SSL del dominio: CN, emisor, validez, 
              estado de confianza, fecha de expiración, etc.
              ${consoleStyles.text.gray}Dominio ➔ Certificado SSL - Registro SSL${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  serialssl   Verifica si un certificado SSL es valido por su número de serie.
              y devuelve la ID del certificado en crt.sh
              ${consoleStyles.text.gray}Serial ➔ ID del certificado - Registro SSL ${consoleControl.resetStyle}          
--------------------------------------------------------------------------------------
 portscan     Escanea los puertos de un dominio o IP mediante una conexion TCP.
    
               📝 Podes ingresar:
               [IP o dominio] [timeout en ms] 
               [puertos/rango de puertos/grupo de puertos]port

               grupo de puertos: web, email, panel, sistem, db, remote, ftp, red,
               infra, other

                Ejemplos de uso:
                
                Ejemplo A: 192.168.1.1
                Ejemplo B: dominio.com
                Ejemplo C: 192.168.1.1 2000 22,80,443
                Ejemplo D: dominio.com 2000 22,80,443
                Ejemplo E: 192.168.1.1 -td 22,80,443  
                Ejemplo F: dominio.com -td 22,80,443
                Ejemplo G: 192.168.1.1 -td 80-443,22
                Ejemplo H: dominio.com -td 80-443,22
                Ejemplo I: 192.168.1.1 -td panel (escanea los puertos de panel)
                Ejemplo J: dominio.com -td email (escanea los puertos de email)
             

  -td          Se agrega en la consulta para colocar el timeout por defecto 
               que es de 4000ms.
               Ejemplo de uso: dominio.com -td 80,443
               
--------------------------------------------------------------------------------------

`;




module.exports = {
  logFileName,logFilePath,logLines,defaultTimeout,listCommands,defaultPorts,companyName,companyNameLower
 
  };