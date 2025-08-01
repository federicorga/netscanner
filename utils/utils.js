const dns = require("dns");
const net = require('net')
const tls = require('tls');
const {arrayCompanyIPs}= require("../config/ipsValue.js");




async function getIp(dominio) { // Función para obtener la IP de un dominio
  try{
    return new Promise((resolve, reject) => {
        const isIp = net.isIP(dominio); // 4 para IPv4, 6 para IPv6, 0 si no es IP
           if (isIp) {
            // Si es una IP, la devolvemos tal cual.
            resolve(dominio);
        } else {
          dns.lookup(dominio, (err, address, family) => {
              if (err) {
                  reject(`${err}`);
              } else {
                  resolve(address);
              }
          });
        }
    });
  } catch (error) {
   
    throw error;
  };
};





function connectionTLS(host, port ,validationConnect=true) {// Esta función establece la conexión TLS y retorna el socket
  return new Promise((resolve, reject) => {
    const socket = tls.connect({
      host,
      port,
      servername: host,  // SNI (Server Name Indication)
      rejectUnauthorized: validationConnect, // Validación del certificado verdadera por defecto para conexiones seguras.
      timeout: 5000, // Timeout de 5 segundos
    }, () => {
      resolve(socket); // Retorna el socket una vez que la conexión se ha establecido
    });

    socket.on('error', (err) => {
      reject(`Error en la conexión TLS: ${err.message}`);
    });

    socket.setTimeout(5000, () => {
      socket.destroy();
      reject('Timeout en la conexión TLS');
    });
  });
}



async function getPtr(ip) { // Función para obtener el PTR (hostname) de una IP mediante DNS-INVERSO
  const esIp = net.isIP(ip);
  if (!esIp) {
    ip = await getIp(ip);
  }

  try {
    const hostnames = await dns.promises.reverse(ip);
    return hostnames;
  } catch (error) {
    if (error.code === "ENOTFOUND" || error.code === "EAI_AGAIN") {
      // Sin PTR configurado o error DNS transitorio
      return [];
    }
    throw error; // Otros errores, los relanzamos
  }
}


function isValidIPV4(ip) { // Función para validar que es una dirección IPv4
    const parts = ip.split('.');
    

    // Verificar que hay exactamente 4 partes
    if (parts.length !== 4) return false;

    // Verificar que cada parte sea un número entre 0 y 255
    for (let i = 0; i < 4; i++) {
        const part = parseInt(parts[i], 10);
        if (isNaN(part) || part < 0 || part > 255) {
            return false;
        }
    }

    return true;
};

function isCompanyIP(ip) { // Función para verificar si una IP pertenece a la empresa
  ip = ip.trim(); // Quita espacios adelante o atrás
  

    // Validar la IP antes de proceder
    if (!isValidIPV4(ip)) {
    
        return false;
    }

    const ipParts = ip.split('.').map(Number);

    for (let i = 0; i < arrayCompanyIPs.length; i++) {
        const [rangeIp, maskStr] = arrayCompanyIPs[i].split('/');
        const rangeParts = rangeIp.split('.').map(Number);
        const mask = parseInt(maskStr, 10);


        if (mask === 8) {
            if (ipParts[0] === rangeParts[0]) {
                return true;
            }
        }

        else if (mask === 16) {
            if (ipParts[0] === rangeParts[0] &&
                ipParts[1] === rangeParts[1]) {
                return true;
            }
        }

        else if (mask === 24) {
            if (ipParts[0] === rangeParts[0] &&
                ipParts[1] === rangeParts[1] &&
                ipParts[2] === rangeParts[2]) {
                return true;
            }
        }

        else if (mask === 28) {
            if (ipParts[0] === rangeParts[0] &&
                ipParts[1] === rangeParts[1] &&
                ipParts[2] === rangeParts[2]) {

                const start = rangeParts[3];
                const end = start + 15;

                if (ipParts[3] >= start && ipParts[3] <= end) {
                    return true;
                }
            }
        }
    }


    return false;
};




async function getServerInfo(ipOrDomain) {
  try {
    const ip = await getIp(ipOrDomain); // Resuelve IP si se pasa un dominio

    // Intenta hacer una consulta PTR (reverse DNS)
    const result = await getPtr(ip);

    const hostname = (Array.isArray(result) && result.length > 0) ? result[0] : "No encontrado";
    
    return { hostname };

  } catch (error) {
    console.error("Error al obtener el hostname:", error.message);
    return { hostname: "No encontrado" };
  }
}








function isPortOpen  (ip,port,timeout=defaultTimeout) { //verifica si el puerto esta abierto o cerrado mediante una conexion TCP y devuelve true o false
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(timeout);

      socket.connect(port, ip, () => {
        resolve(true);
        socket.destroy();
      });

      socket.on("error", () => {
        resolve(false);
      });
    });
  };

  function isPrivateIP(ip) { // Función para verificar si una IP es privada o pública
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(part => isNaN(part) || part < 0 || part > 255)) {
        return null; // IP inválida
    }

    const [a, b] = parts;

    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;

    return false;
};


async function getRawSSLCertificate(host, port) { //conecta y obtiene el certificado en bruto.
  return new Promise((resolve, reject) => {
    const socket = tls.connect({
      host,
      port,
      servername: host,
      rejectUnauthorized: false,
      timeout: 5000
    }, () => {
      try {
        const cert = socket.getPeerCertificate(true); //el servidor remoto con el que estás haciendo la conexión TLS. El argumento true indica que quieres la cadena completa de certificados 
        if (!cert || !cert.raw) {
          reject("❗[Error] No se pudo obtener el certificado (raw)");
          socket.end();
          return;
        }
        resolve(cert);
        socket.end();
      } catch (e) {
        reject("❗[Error] al obtener certificado: " + e.message);
        socket.end();
      }
    });

    socket.on('error', (err) => {
      reject(`❗[Error] al conectar por SSL: ${err.message}`);
    });

    socket.setTimeout(5000, () => {
      socket.destroy();
      reject("Timeout en conexión SSL");
    });
  });


};


function formatDate(isoString) {
    if (!isoString || typeof isoString !== 'string') return 'No disponible';
    const date = new Date(isoString);
    if (isNaN(date)) return 'Fecha inválida';
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};





module.exports={getIp,isCompanyIP,getPtr,getRawSSLCertificate,getServerInfo,isPortOpen,isPrivateIP,formatDate};