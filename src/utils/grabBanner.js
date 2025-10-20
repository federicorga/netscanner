
const net = require('net');

const { extractPortsFromStringToArray } = require('../Business/services/portScannerService.js');
const { portGroups } = require('../Infrastructure/config/portsConfig.js');

/**
 * Intenta conectarse a un puerto TCP y leer el banner de bienvenida (si lo hay).
 * @param {string} ip - Dirección IP del servidor.
 * @param {number} port - Puerto TCP al que conectarse.
 * @param {number} timeout - Tiempo máximo en ms antes de cancelar.
 * @returns {Promise<string>} - Banner del servicio o descripción.
 */


function grabBanner(ip, port, timeout = 3000) {
  return new Promise((resolve) => {
    let banner = '🟢 '; // aqui se almacena el baner extraido de el puerto escaneado 
    const socket = new net.Socket();

    socket.setTimeout(timeout);

    

    socket.connect(port, ip, () => {
      // Conexión establecida, esperar data
    });

    socket.on('data', (data) => {
      banner += data.toString();
      socket.destroy(); // cerrar después de recibir algo
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(`⏱️ Timeout (${port})`);
    });

    socket.on('error', (err) => {
      resolve(`❌ Error - (${port}): ${err.message}`);
    });

    socket.on('close', () => {
      resolve(banner.trim() || `✅ Connected (${port}) - sin banner`);
    });
  });
}


async function getBannersFromInput(input) { //
  const [ipInput, portsInput] = input.trim().split(" ");

  const ip = ipInput;
  const timeout = 4000;

  let ports;
  if (portGroups?.[portsInput]) {
    ports = portGroups[portsInput].ports.map(p => p.port);
    console.log(`\n${portsInput}: ${portGroups[portsInput].description}`);
  } else {
    ports = extractPortsFromStringToArray(portsInput);
    
    
  }

  

  if (!ports || ports.length === 0) {
    console.log("🚫 Escaneo cancelado: no se proporcionaron puertos válidos.");
    return;
  }

  console.log(`\n🔍 Grabbing banners en ${ip} (timeout: ${timeout}ms)...\n`);

  for (const port of ports) {
    const banner = await grabBanner(ip, port, timeout);
    console.log(`🛠️ [${ip}:${port}] → ${banner}`);
  }
}


module.exports = { getBannersFromInput };