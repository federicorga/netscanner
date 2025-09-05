const { defaultTimeout,logLines } = require("../config/config");

const { getIp, isPortOpen} = require("../utils/utils.js");
const {getServerInfo } = require("../utils/utils.js");




async function scanServerInfo(ip, timeout=defaultTimeout) {
  const stdout = process.stdout; // Limpiamos la línea de salida
  let serverType = "Desconocido";
  let osType = "Desconocido";

  try {
    // Mostrar mensaje de espera
    stdout.write("⏳ Analizando servidor...");

    // Puertos para cPanel, Plesk, Linux y Windows
    const cPanelPorts = [2083, 2087, 2082, 2095, 2096]; // cPanel
    const pleskPorts = [8443, 8880]; // Plesk
    const linuxPorts = [22]; // SSH (Linux)
    const windowsPorts = [3389]; // RDP (Windows)

    const ipAddress = await getIp(ip); // Obtener la IP de la entrada del usuario
    const serverDate= await getServerInfo(ip);
    // Función para comprobar si un puerto está abierto
   

    // Comprobamos los puertos de cPanel y Plesk
    const cPanelPromises = cPanelPorts.map((port) => isPortOpen(ip,port,timeout));
    const pleskPromises = pleskPorts.map((port) => isPortOpen(ip,port,timeout));
    const linuxPromises = linuxPorts.map((port) => isPortOpen(ip,port,timeout));
    const windowsPromises = windowsPorts.map((port) => isPortOpen(ip,port,timeout));

    const [cPanelResults, pleskResults, linuxResults, windowsResults] = await Promise.all([
      Promise.all(cPanelPromises),
      Promise.all(pleskPromises),
      Promise.all(linuxPromises),
      Promise.all(windowsPromises),
    ]);

    // Borrar la línea del "esperando..."
    stdout.clearLine(0); // Limpia la línea
    stdout.cursorTo(0);  // Mueve el cursor al inicio

    // Detectar cPanel o Plesk
    if (cPanelResults.some((result) => result)) {
      serverType = "cPanel";
    } else if (pleskResults.some((result) => result)) {
      serverType = "Plesk";
    }

    // Detectar si es Linux o Windows
    if (linuxResults.some((result) => result)) {
      osType = "Linux (SSH)";
    } else if (windowsResults.some((result) => result)) {
      osType = "Windows (RDP)";
    }

    // Devolver la información en lugar de solo imprimirla
    const info = `\n📌 Información del servidor:\n📍 IP: ${ipAddress}\n🏢 HostName: ${serverDate.hostname}\n🛠️ Panel de control: ${serverType}\n💽 Sistema operativo: ${osType}\n`;

    const tableData = [
  { Campo:"📍 IP", Valor: ipAddress },
  { Campo:"🏢 HostName", Valor: serverDate.hostname },
  { Campo:"🔧 Panel Control", Valor: serverType },
  { Campo:"💽 Sistema operativo", Valor: osType }
];


    
    logLines.push(tableData);
    console.log(logLines);
    return info; // Devuelves el resultado como un string
  } catch (error) {  
    console.error("Error en scanServerInfo:", error);
    return `⚠️ Error al escanear el servidor: ${error.message}`;
  }
};


module.exports = { scanServerInfo};