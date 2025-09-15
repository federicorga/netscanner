const { knownPortsServices } = require("../../Infrastructure/config/portsConfig.js");
const { consoleStyles, consoleControl } = require("../../Presentation/CLI/systemCommands.js");
const { isPortOpen, getRawSSLCertificate } = require("../../utils/utils.js");
const https = require("https");
const crypto = require('crypto');





async function getSSLCertificateInfo(host, port) {// Función para obtener información del certificado SSL de un host y puerto
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host,
        port,
        servername: host, // SNI, importante para HTTPS moderno
        rejectUnauthorized: false, // No validar si el cert es válido (podés cambiar esto)
        timeout: 5000
      },
      () => {
        const cert = socket.getPeerCertificate();
     

        if (!cert || Object.keys(cert).length === 0) {
          reject("No se pudo obtener el certificado SSL");
        } else {
       

          let rawSANs = cert.subjectaltname || "";
          // Convertir a array y limpiar los "DNS:"
          let sanArray = rawSANs.split(',').map(entry => entry.trim().replace(/^DNS:/, ''));

          // Mover el último al principio
          sanArray.unshift(sanArray.pop());

          // Volver a convertir en string si lo necesitás
          let cleanSANs = sanArray.join(',');

            // Obtener fingerprints
        let fingerprints;
        try {
          fingerprints = getCertificateFingerprints(cert);
          
          
          
        } catch (err) {
          fingerprints = { sha1: "No disponible", sha256: "No disponible" };
        }
          
          resolve({
            port,
            subject: cert.subject.CN || "Desconocido",
            issuer: `${cert.issuer.O || ''} ${cert.issuer.CN || ''}`.trim() || "Desconocido", // informacion mas completa del certificado
            serial: cert.serialNumber || "No disponible", //Serial del certificado
            
            valid_from: cert.valid_from,
            valid_to: cert.valid_to,
            valid: socket.authorized ? "Sí✅" : "No❌",
            reason: socket.authorized ? "Certificado válido" : (socket.authorizationError || "Desconocido"),
            sans: cleanSANs || "No especificado",
            sha1: fingerprints.sha1,
            sha256: fingerprints.sha256,
          });
        }
        socket.end();
      }
    );

    socket.on('error', (err) => {
      reject(`Error al conectar por SSL: ${err.message}`);
    });

    socket.setTimeout(5000, () => {
      socket.destroy();
      reject("Timeout en conexión SSL");
    });
  });
};


async function getSSLInfoFormatted(ip, timeout = 5000) {// Función para obtener los certificados SSL de múltiples puertos y devolverlos formateados
  const sslAllPorts = [443, 2083, 2087,2096, 8443, 32001]; // Puertos comunes de SSL
   const stdout = process.stdout; // Limpiamos la línea de salida
  let sslInfo = [];
  let sslErrors = [];
  let sslPortsScanned=[];

  if(await isPortOpen(ip,8443,timeout)){
    sslPortsScanned= sslAllPorts.filter(port => port !== 2083 && port !== 2087);}
    else{
      sslPortsScanned= sslAllPorts.filter(port => port !==8443);
    }
stdout.write("⏳ Buscando certificados SSL...");
  for (const port of sslPortsScanned) {
   
    
 
      try {
        const cert = await getSSLCertificateInfo(ip, port);
        
        sslInfo.push(cert); 
        
      } catch (e) {
        sslErrors.push({ port, error: e });
      }
    
  }

    // Borrar la línea del "esperando..."
    stdout.clearLine(0); // Limpia la línea
    stdout.cursorTo(0);  // Mueve el cursor al inicio

  let info = "";

  // Si encontramos certificados SSL, los mostramos
  if (sslInfo.length > 0) {
    info += `\n${consoleStyles.text.green}🔐 Certificados SSL detectados:${consoleControl.resetStyle}\n`;
   for (const cert of sslInfo) {
      const idcert= await getCrtShIdFromSHA1 (cert.sha1);
        const serviceName = knownPortsServices.find(p => p.port === cert.port)?.name || "Desconocido";
      // Aquí ahora imprimimos correctamente el puerto
      info += `\n${consoleStyles.text.cyan}→ Puerto ${cert.port} (${serviceName})::${consoleControl.resetStyle}\n`; // Ya no es undefined
      info += `   📄 Dominio (CN): ${cert.subject}\n`;
      info+= `   Servername: ${cert.setHeader}\n`;
      info += `   🏢 Emisor:${consoleStyles.text.yellow}${cert.issuer}${consoleControl.resetStyle}\n`;
      info += `   🔑 Número de serie Certificado: ${cert.serial}\n`;
      info += `   🔒 Huella SHA1: ${cert.sha1}\n` ;
      info += `   🌐 Ver Certificado: https://crt.sh/?q=${idcert}\n`;
      info += `   📆 Válido desde: ${cert.valid_from}\n`;
      info += `   ⏳ Expira: ${cert.valid_to}\n`;
      info += `   🛡️​Dominios incluidos (SANs): ${consoleStyles.text.green}${cert.sans}${consoleControl.resetStyle}\n`;
      info += `   📜 Certificado válido: ${cert.valid}\n`;
 
     // Mostrar el motivo SOLO si el certificado NO es válido
    if (cert.valid=== "No❌") {
       let reasonMsg = cert.reason;
       let reason="";
       if (reasonMsg === "ERR_TLS_CERT_ALTNAME_INVALID") {
     reason= "   ⚠️ El certificado no coincide con el dominio solicitado (probablemente sea el certificado del hostname del servidor)";
  }
  
      info += `   ❗ Motivo: ${consoleStyles.text.red}$${cert.reason}${consoleControl.resetStyle}\n${reason}\n`;
    
    }
    };
  } else {
    info += `\n🔐 Certificados SSL: No detectado\n`;
  };
    if (sslErrors.length > 0) {
  info += `\n❗ [Advertencia] detectadas en los siguientes puertos:\n`;
  sslErrors.forEach(err => {
    const serviceName = knownPortsServices.find(p => p.port === err.port)?.name || "Desconocido";
    info += `→ Puerto ${err.port} (${serviceName}):: ${consoleStyles.text.red}${err.error}${consoleControl.resetStyle}\n`;
  });
};

  return info;
};


function getCertificateFingerprints(cert) { // Función para obtener los fingerprints (huellas SHA1 y SHA256) del certificado
   // El certificado viene en formato PEM en cert.raw (buffer)

  if (!cert?.raw) {
    throw new Error('❗ [Error] Certificado inválido o sin campo raw');
  }

  const rawCert = cert.raw; // Buffer con el certificado DER

  // Función interna para formatear hashes: "AABBCC" → "AA:BB:CC"
  const formatHash = (hash) => hash.match(/.{1,2}/g).join(':');
        // Calculamos SHA-1 y SHA-256:
  const sha1Raw = crypto.createHash('sha1').update(rawCert).digest('hex').toUpperCase();
  const sha256Raw = crypto.createHash('sha256').update(rawCert).digest('hex').toUpperCase();

  return {
    sha1: formatHash(sha1Raw),
    sha256: formatHash(sha256Raw)
  };
};



async function getCrtShIdFromSHA1(sha1) { //Devuelve el ID del Certificado  pasando el SHA1 encontrado en la pagina CRT.SH
  const url = `https://crt.sh/?q=${sha1}`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const regex = /\?id=(\d+)/g;
        const matches = [];
        let match;
        while ((match = regex.exec(data)) !== null) {
          matches.push(match[1]);
        }
        if (matches.length > 0) {
          resolve(matches[0]); // Devuelvo el primer id encontrado
    
        } else {
          reject(new Error('No se encontró ningún ID en la respuesta'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};



async function getCertificateSSLChain(cert) { //Chain es una cadena de certificados. Esta funcion devuelve un objeto donde dentro posee un array(Chain) con esta cadena [Leaf,Intermedio,Raíz] por cada puerto pasado.
  //devuelve la cadena de certificados SSL completa: el certificado Leaf, los intermedios y la raíz.
  let chain = [];
  let currentCert = cert;
  let index = 0;

  while (currentCert && currentCert.raw) {
    let rawSANs = currentCert.subjectaltname || "";
    let sanArray = rawSANs.split(',').map(entry => entry.trim().replace(/^DNS:/, ''));
    let cleanSANs = sanArray.join(',');
    let fingerprints;
    
    try {
      fingerprints = getCertificateFingerprints(currentCert); // obtiene la huella SHA1 o SHA256
      
    } catch {
      fingerprints = { sha1: "N/A", sha256: "N/A" };
    }

    chain.push({
      index,
      type: index === 0 ? "Leaf" : currentCert.issuerCertificate === currentCert ? "Raíz" : "Intermedio",
      subject: currentCert.subject?.CN || "Desconocido",
      issuer: `${currentCert.issuer?.O || ''} ${currentCert.issuer?.CN || ''}`.trim(),
      serial: currentCert.serialNumber || "No disponible",
      valid_from: currentCert.valid_from,
      valid_to: currentCert.valid_to,
      sans: cleanSANs || "No especificado",
      sha1: fingerprints.sha1,
      sha256: fingerprints.sha256
    });

    if (!currentCert.issuerCertificate || currentCert.issuerCertificate === currentCert) break;
    currentCert = currentCert.issuerCertificate;
    index++;
  }

  return {
    chain
  };
};


async function formatCertChainInfo(certChainObj, port, serviceName = '') {
  let info = '';
  

  for (const cert of certChainObj.chain) {
    // Suponiendo que esta función obtiene el ID de crt.sh en base al serial (o sha1)
  let idcert = 'No disponible';

      try {
        idcert = await getCrtShIdFromSHA1(cert.sha1);
      } catch (err) {
        idcert = 'No encontrado (crt.sh)';
      }
    

    info += `\n${consoleStyles.text.cyan}→ Puerto ${port} (${serviceName})::${consoleControl.resetStyle}\n`;
    info += `   🖥️ Server: ${consoleStyles.text.magenta}${cert.headers}${consoleControl.resetStyle}\n`;
    info += `   📄 Dominio (CN): ${cert.subject}\n`;
    info += `   🏢 Emisor: ${consoleStyles.text.yellow}${cert.issuer}${consoleControl.resetStyle}\n`;
    info += `   🔑 Número de serie Certificado: ${cert.serial}\n`;
    info += `   🔒 Huella SHA1: ${cert.sha1}\n`;
    info += `   🌐 Ver Certificado: https://crt.sh/?q=${idcert}\n`;
    info += `   📆 Desde: ${cert.valid_from} | ⏳ Hasta: ${cert.valid_to}\n`;
    info += `   🛡️ Dominios incluidos (SANs): ${consoleStyles.text.green}${cert.sans}${consoleControl.resetStyle}\n`;
    info += `   📜 Certificado válido: ${cert.valid || 'No disponible'}\n`;
  }

  return info;
}



async function pruebaSSL(input) {
  try {

      const [hostnameInput, portInput] = input.trim().split(" ");


    let hostname = hostnameInput || "localhost"
    ;
    // Obtiene el certificado crudo (leaf)
    let port = portInput || 443; // Si no se pasa puerto, usar 443 por defecto

  
    const rawCert = await getRawSSLCertificate(hostname, port);// Asegurarse de que se obtiene el certificado crudo
 

    // Procesa la cadena a partir del certificado crudo
    const certChainObj = await getCertificateSSLChain(rawCert, port);

 

    const formattedInfo = await formatCertChainInfo(certChainObj, port, 'PLESK');



    return formattedInfo;
  } catch (error) {
   // Asegurar que se tenga un mensaje legible:
    const msg = error?.message || error || "Error desconocido";
    throw new Error("Error en pruebaSSL: " + msg);
  }
};








module.exports = { getSSLInfoFormatted,getCertificateFingerprints, getCrtShIdFromSHA1,pruebaSSL};