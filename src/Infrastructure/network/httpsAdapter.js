// Conexiones HTTPS de alto nivel
//si estás haciendo una petición HTTP segura (https.request())

const https = require('https');


/**
 * Obtiene los headers HTTPS de un dominio o subdominio.
 * @param {string} host - Dominio o subdominio (sin protocolo), por ejemplo: 'dominio.com'
 * @param {number} [port=443] - Puerto opcional (por defecto 443)
 * @returns {Promise<object>} - Headers de respuesta
 */


async function getHTTPSHeadersFromHost(host, port = 443) {
  return new Promise((resolve) => {
    const options = {
      hostname: host,
      port: port,
      path: '/',
      method: 'GET',
      rejectUnauthorized: false,
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      resolve(res.headers);
    });

    req.on('error', (err) => {
      if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
        console.warn(`🌐 No se pudo resolver el hostname "${host}": ${err.code}`);
      } else {
        console.error(`❌ Error al obtener headers de ${host}: ${err.message}`);
      }
      resolve({}); // Siempre devolvemos un objeto vacío para continuar el flujo
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn(`⏱️ Timeout al conectar con ${host}`);
      resolve({});
    });

    req.end();
  });
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



module.exports = {getHTTPSHeadersFromHost,getCrtShIdFromSHA1 };