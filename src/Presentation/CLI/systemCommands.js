const { exec } = require('child_process'); // Para ejecutar comandos de sistema
const { logo } = require('../../utils/logoCMD');
const { companyName, commands } = require('../../Infrastructure/config/config');




const consoleStyles = { // Estilos de consola
  text: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    mustard:"\x1b[38;5;214m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
     // Colores extendidos
  orange: "\x1b[38;5;208m",       // naranja fuerte
  lightBlue: "\x1b[38;5;117m",    // celeste claro
  gray: "\x1b[38;5;245m",         // gris medio
  pink: "\x1b[38;5;213m",         // rosa
  lightGreen: "\x1b[38;5;119m",   // verde claro
  lightCyan: "\x1b[38;5;159m",    // cyan claro
  lightgray:"\x1b[38;5;250m"

  },
  background: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
     // Colores extendidos
  orange: "\x1b[38;5;208m",       // naranja fuerte
  lightBlue: "\x1b[38;5;117m",    // celeste claro
  gray: "\x1b[38;5;245m",         // gris medio
  pink: "\x1b[38;5;213m",         // rosa
  lightGreen: "\x1b[38;5;119m",   // verde claro
  lightCyan: "\x1b[38;5;159m",    // cyan claro
  },
  style: {
    bold: "\x1b[1m",
    underline: "\x1b[4m",
    inverse: "\x1b[7m"
  },
};


const colorMap = {
  type: consoleStyles.text.yellow,
  TTL: consoleStyles.text.yellow,
  name: consoleStyles.text.green,
  data: consoleStyles.text.green,
 __head__: consoleStyles.text.cyan,
 companyColor: consoleStyles.text.mustard,
  // Podés agregar más según necesites
};


const consoleControl={ // Comandos de control de consola
  resetStyle: "\x1b[0m", // Resetea todos los estilos
  clear: "\x1b[2J\x1b[0;0H", // Limpia la consola y mueve el cursor a la posición inicial
  resetConsole: "\x1Bc" // Resetea la consola
}



function printHostingCheckMessage(result){ 
  const icon= result.success.isCompany ?"🛰️ ✅ " : "🛰️ ❌ ";
  const coloredMessage = result.message.replace(
  companyName,
  `${colorMap.companyColor}${companyName}${consoleControl.resetStyle}`
);

return console.log("\n" + icon + coloredMessage+ "\n");
}

// Helpers centralizados
function formatMessage(message) {
  return `\n${consoleStyles.text.lightBlue}${message}${consoleControl.resetStyle}`;
}

function formatSuccess(message) {
  return `\n${consoleStyles.text.green}✅ [OK] ${message}${consoleControl.resetStyle}`;
}

function formatError(message) {
  return `\n${consoleStyles.text.red}❗ [Error] ${message}${consoleControl.resetStyle}`;
}

function formatRequest(message) { //
  return `\n${consoleStyles.text.lightBlue}${message}${consoleControl.resetStyle}`;
}

function formatNotFound(message) {
  return `\n${consoleStyles.text.orange}❌ [Not found] ${message}${consoleControl.resetStyle}`;
}


function formatWarning(message) {
  return `\n${consoleStyles.text.yellow}⚠️ [Warning] ${message}${consoleControl.resetStyle}`;
}


function formatMessage(type, message) {
    switch (type) {
        case "success":
            return formatSuccess(message);
        case "error":
            return formatError(message);
        case "warning":
            return formatWarning(message);
        case "not_found":
            return formatNotFound(message);
        case "request":
            return formatRequest(message);
        default:
            return message;
    }
}

function clearConsole() {//Limpia la consola dependiendo del sistema operativo
  if (process.platform === 'win32') {
    exec('cls', (err, stdout, stderr) => {
      if (err) {
        console.error(formatError("No se pudo limpiar la consola"), err);
        return;
      }
      process.stdout.write(consoleControl.resetConsole);  // Enviar código de escape para borrar la consola
      console.log(logo); 
    });
  } else {
    process.stdout.write(consoleControl.resetConsole);  // Enviar código de escape para borrar la consola
    console.log(logo); 
  }
};





function getCommand(id) {
  const command = commands.find(cmd => cmd.id === id);
  if (command) {
    return `${consoleStyles.text.pink}${command.name}${consoleControl.resetStyle}`;  // Retorna solo el nombre
  } else {
    return "Comando no encontrado";  // Si no se encuentra el comando
  }
}

const listCommands = `
ℹ️ ${consoleStyles.text.green} COMANDOS DISPONIBLES:  ${consoleControl.resetStyle}

--------------------------------------------------------------------------------------
  ${getCommand(1)}       Muestra esta lista de comandos.
--------------------------------------------------------------------------------------
  ${getCommand(2)}        Sale de la aplicación.
--------------------------------------------------------------------------------------
  ${getCommand(3)}       Limpia la pantalla de la terminal.
--------------------------------------------------------------------------------------
  ${getCommand(4)}     Configura un proveedor DNS para realizar las consultas.
--------------------------------------------------------------------------------------
  ${getCommand(26)}    Chequea si el dominio o IP tiene un servidor DNS configurado.
              ${consoleStyles.text.gray}Dominio o IP ➔ Servidor DNS configurado${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(5)}        Verifica si el host (IP o dominio) está accesible desde tu red. 
              Usa paquetes ICMP para probar conectividad.
              ${consoleStyles.text.gray}Dominio o IP ➔ Respuesta de ping${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(6)}          Resuelve el dominio a su dirección IP.
             ${consoleStyles.text.gray} Dominio ➜ IP (lookup DNS) ${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(7)}    Verifica si una IP esta administrado por ${companyName}.
               ${consoleStyles.text.gray}IP ➜ ${companyName} - IP administrada${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(8)}       Muestra una lista con todos los rangos de IP administrados por ${companyName}.
--------------------------------------------------------------------------------------
  ${getCommand(9)}      Muestra información detallada de la IP o dominio:
              ISP, ubicación, ASN, etc. (via ipinfo.io)
              ${consoleStyles.text.gray}Dominio o IP ➔ Información${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(10)}       Realiza una consulta WHOIS para obtener información del dominio o IP.
              Incluye datos de registro, propietario, fechas, etc.
              
  ${getCommand(25)}          Se agrega al final de la consulta y muestra todos los campos del registro 
              WHOIS en formato JSON completo. (Recomendado usar -f para busqueda ip)
              ${consoleStyles.text.gray}Dominio o IP ➔ Información WHOIS${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(11)}       Escanea la información del servidor
              (panel de control, sistema operativo, etc.)
              ${consoleStyles.text.gray}Dominio o IP ➔ Información del servidor${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(12)}         Realiza una búsqueda inversa de IP y devuelve el 
              nombre de dominio asociado.
              ${consoleStyles.text.gray}IP ➜ Dominio - registro PTR${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(13)}           Muestra los registros A de un dominio. Indica la dirección IPv4 a la que 
              resuelve ese nombre de dominio o subdominio. Indica en donde estan alojados
              los servicios o recursos del dominio como el Servidor web (hosting). 
              ${consoleStyles.text.gray}Dominio ➔ IP - Registro A${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(14)}          Muestra los registros MX de un dominio y rastrea a donde apunta 
              (incluido PTR para rastreo profundo).
              ${consoleStyles.text.gray}Dominio ➔ Servidores de correo - Registro MX${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(15)}          Muestra los registros NS. Especifica servidores de nombres autorizados
              (Servidores DNS autoritativos)para el dominio Indica quien gestiona los 
              servidores DNS autoritativos del dominio.
              ${consoleStyles.text.gray}Dominio ➔ Servidores de nombres - Registro NS${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(16)}       Verifica si el dominio tiene un alias CNAME.
              ${consoleStyles.text.gray}CNAME ➜ Otro dominio - Registro CNAME${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(17)}         Muestra los registros TXT del dominio. Incluye SPF, DKIM, 
              verificación Google, etc.
              ${consoleStyles.text.gray}Dominio ➔ TXT - Registro TXT${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(18)}         Muestra los registros SPF del dominio (Este escrito en TXT). 
              Devuelve una lista de servidores de correo o rutas indirectas hacia 
              ellos que están autorizados a enviar emails en su nombre.
              ${consoleStyles.text.gray}Dominio ➔ SPF - Registro SPF${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(19)}        Muestra el registro DKIM del dominio.
              Usa claves criptográficas para autenticar que un correo electrónico fue 
              enviado y autorizado por el dueño del dominio, 
              y que no fue modificado en tránsito.  
              Protocolo para autenticar correos usando firmas digitales.
              ${consoleStyles.text.gray}Dominio ➔ DKIM - Registro DKIM${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(20)}       Muestra el registro DMARC del dominio.
              Política de autenticación y reporte para correos.
              Permite que un dominio especifique a los servidores de correo receptores 
              cómo manejar los correos que parecen venir de su dominio, pero que no 
              pasan ciertas verificaciones de autenticidad (como SPF y DKIM)
              ${consoleStyles.text.gray}Dominio ➔ DMARC - Registro DMARC${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(27)}      Intenta conectarse a un puerto TCP y leer el banner si existe. 
              Un banner es el mensaje de bienvenida que un servicio envia al conectarse.
              Se envia el o los puertos que se desea escanera Ejemplo : 192.168.1.1 22,80,443 
              ${consoleStyles.text.gray}IP ➔ Banner del servicio - Registro de banner${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(21)}         Verifica el certificado SSL del dominio: CN, emisor, validez, 
              estado de confianza, fecha de expiración, etc.
              ${consoleStyles.text.gray}Dominio ➔ Certificado SSL - Registro SSL${consoleControl.resetStyle}
--------------------------------------------------------------------------------------
  ${getCommand(22)}    Verifica si un certificado SSL es valido por su número de serie.
              y devuelve la ID del certificado en crt.sh
              ${consoleStyles.text.gray}Serial ➔ ID del certificado - Registro SSL ${consoleControl.resetStyle}          
--------------------------------------------------------------------------------------
  ${getCommand(23)}    Escanea los puertos de un dominio o IP mediante una conexion TCP.
    
               📝 Podes ingresar:
               [IP o dominio] [timeout en ms] 
               [puertos/rango de puertos/grupo de puertos]port

               grupo de puertos: web, email, panel, ssl, sistem, db, remote, ftp, red,
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
             

  ${getCommand(24)}          Se agrega en la consulta para colocar el timeout por defecto 
               que es de 4000ms.
               Ejemplo de uso: dominio.com -td 80,443
               
--------------------------------------------------------------------------------------

`;



module.exports={clearConsole,consoleStyles,consoleControl,formatMessage,colorMap,printHostingCheckMessage};