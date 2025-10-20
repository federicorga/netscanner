

const { extractPortsFromStringToArray } = require('./portScannerService.js');
const { portGroups } = require('../../Infrastructure/config/portsConfig.js');
const { grabBanner } = require('../../Infrastructure/network/tcpAdapter.js');

/**
 * Intenta conectarse a un puerto TCP y leer el banner de bienvenida (si lo hay).
 * @param {string} ip - Dirección IP del servidor.
 * @param {number} port - Puerto TCP al que conectarse.
 * @param {number} timeout - Tiempo máximo en ms antes de cancelar.
 * @returns {Promise<string>} - Banner del servicio o descripción.
 */





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