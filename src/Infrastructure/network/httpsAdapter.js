// Conexiones HTTPS de alto nivel
//si estás haciendo una petición HTTP segura (https.request())

const https = require('https');


/**
 * Obtiene los headers HTTPS de un dominio o subdominio.
 * @param {string} host - Dominio o subdominio (sin protocolo), por ejemplo: 'wavenet.com'
 * @param {number} [port=443] - Puerto opcional (por defecto 443)
 * @returns {Promise<object>} - Headers de respuesta
 */
async function getHTTPSHeadersFromHost(host, port = 443) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: port,
      path: '/',
      method: 'GET',
      rejectUnauthorized: false, // Permite conexiones con certs no válidos (opcional)
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      resolve(res.headers);
    });

    req.on('error', (err) => {
      reject((`Error al obtener headers de ${host}: ${err.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject((`Timeout al conectar con ${host}`));
    });

    req.end();
  });
}

module.exports = {getHTTPSHeadersFromHost };