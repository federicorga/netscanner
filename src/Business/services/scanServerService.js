const { defaultTimeout } = require("../../Infrastructure/config/config.js");
const { getIp, getPtr } = require("../../Infrastructure/network/dnsAdapter.js");
const { isPortOpen } = require("../../Infrastructure/network/tcpAdapter.js");



async function getServerInfo(ipOrDomain) {
  try {
    const ip = await getIp(ipOrDomain); // Resuelve IP si se pasa un dominio

    // Intenta hacer una consulta PTR (reverse DNS)
    const result = await getPtr(ip);

    const hostname = (Array.isArray(result) && result.length > 0) ? result[0] : "No encontrado";
    
    return { hostname };

  } catch (error) {
    console.error("No se pudo obtener el hostname:", error.message);
    return { hostname: "No encontrado" };
  }
};

async function getServicesInfo(ip,timeout=defaultTimeout){ // Función para escanear servicios

   let panelType = "Desconocido";
  let osType = "Desconocido";
  let header= "Desconocido" //await getHTTPSHeadersFromHost(serverDate.hostname);
    // Devolver la información en lugar de solo imprimirla
  
    // Puertos para cPanel, Plesk, Linux y Windows
    const cPanelPorts = [2083, 2087, 2082, 2095, 2096]; // cPanel
    const pleskPorts = [8443, 8880]; // Plesk
    const linuxPorts = [22]; // SSH (Linux)
    const windowsPorts = [3389]; // RDP (Windows)


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



    // Detectar cPanel o Plesk
    if (cPanelResults.some((result) => result)) {
      panelType = "cPanel";
    } else if (pleskResults.some((result) => result)) {
      panelType = "Plesk";
    }

    // Detectar si es Linux o Windows
    if (linuxResults.some((result) => result)) {
      osType = "Linux (SSH)";
    } else if (windowsResults.some((result) => result)) {
      osType = "Windows (RDP)";
    }


    return { panelType, osType, header };
  
}


async function scanServerService(domainOrIp) {

  try {
   
  const ipAddress = await getIp(domainOrIp);
  const serverDate= await getServerInfo(domainOrIp);
  const service= await getServicesInfo(ipAddress);
   
  const tableData = [
  { Campo:"📍 IP", Valor: ipAddress },
  { Campo:"🏢 HostName", Valor: serverDate.hostname },
  { Campo: "🧊 ServerType", Valor: service.header },
  { Campo:"🔧 Panel Control", Valor:service.panelType },
  { Campo:"💽 Sistema operativo", Valor: service.osType },

];

    return tableData; // Devuelves el resultado como un string
  } catch (error) {  

    return `No se pudo escanear el servidor: ${error.message}`;
  }
};


module.exports = { scanServerService};