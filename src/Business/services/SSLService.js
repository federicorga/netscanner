const { knownPortsServices } = require("../../Infrastructure/config/portsConfig.js");
const { consoleStyles, consoleControl } = require("../../Presentation/CLI/systemCommands.js");
const { calculateDaysExpiration} = require("../../utils/utils.js");
const crypto = require('crypto');
const { getRawSSLCertificate } = require("../../Infrastructure/network/tlsAdapter.js");
const { getCrtShIdFromSHA1 } = require("../../Infrastructure/network/httpsAdapter.js");



function getCertificateFingerprints(cert) { // Función para obtener los fingerprints (huellas SHA1 y SHA256) del certificado
   // El certificado viene en formato PEM en cert.raw (buffer)

  if (!cert?.raw) {
    throw new Error('Certificado inválido o sin campo raw');
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
    chain,
    valid:cert.valid,
    reasons:currentCert.reasons
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
    serviceName = knownPortsServices.find(p => p.port === port)?.service || "Desconocido";

    const daysExpiration = calculateDaysExpiration(cert.valid_to);

    info += `\n${consoleStyles.text.cyan}→ Puerto ${port} (${serviceName})::${consoleControl.resetStyle}\n`;
    info += `   🖥️ Server: ${consoleStyles.text.magenta}${cert.headers}${consoleControl.resetStyle}\n`;
    info += `   📄 Common name (CN): ${cert.subject}\n`;
    info += `   🏢 Emisor: ${consoleStyles.text.yellow}${cert.issuer}${consoleControl.resetStyle}\n`;
    info += `   🔑 Serial Number: ${cert.serial}\n`;
    info += `   🔒 Huella SHA1: ${cert.sha1}\n`;
    info += `   👁️ Ver Certificado: https://crt.sh/?q=${idcert}\n`;
    info += `   📆 Desde: ${cert.valid_from} |  Hasta: ${cert.valid_to}\n`;
    info += `   ⏳ El certificado expira en: ${daysExpiration}\n`;
    info += `   🛡️ Dominios incluidos (SANs): ${consoleStyles.text.green}${cert.sans}${consoleControl.resetStyle}\n`;
  }

   info += ` \n   📜 Certificado válido: ${certChainObj.valid? "Sí✅" : "No❌"}\n`;

   if(!certChainObj.valid && certChainObj.reasons){
   info += ` ${certChainObj.reasons}  `
   }

  return info;
}


async function SSLService(input) {

  try {

    const [hostnameInput, portInput] = input.trim().split(" ");

    let hostname = hostnameInput || "localhost"
    ;
    // Obtiene el certificado crudo (leaf)
    let port = portInput || 443; // Si no se pasa puerto, usar 443 por defecto

    const rawCert = await getRawSSLCertificate(hostname, port);// Asegurarse de que se obtiene el certificado crudo
 
    // Procesa la cadena a partir del certificado crudo
    const certChainObj = await getCertificateSSLChain(rawCert, port);

    const formattedInfo = await formatCertChainInfo(certChainObj, port);

    return formattedInfo;
  } catch (error) {
   // Asegurar que se tenga un mensaje legible:
    const msg = error?.message || error || "Error desconocido";
    throw new Error("Error en pruebaSSL: " + msg);
  }
};


module.exports = { getCertificateFingerprints, getCrtShIdFromSHA1,SSLService};