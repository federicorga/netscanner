
const net = require("net");
const { saveLogsToFile } = require("../utils/logsSave.js");
const {defaultTimeout,defaultPorts,logLines}= require("../config/config.js");
const { portGroups } = require("../config/portGroups.js");
const { knownPortsServices } = require("../config/portsConfig.js");
const { getIp } = require("../utils/utils.js");
const { consoleStyles, consoleControl } = require("../utils/systemCommands.js");



async function getPortsStatus(input) { //Muestra El estado de todos los puertos escaneados pasados por parametro de una ip o domino.
 
    const [ipInput, timeoutInput, portsInput] = input.trim().split(" ");

    const ip = ipInput;
    const timeout = timeoutInput === '-td' ? defaultTimeout : parseInt(timeoutInput) || defaultTimeout;
    let ports;

    if (portGroups[portsInput]) {
      // Si coincide con un grupo (ej: "correo"), usamos sus puertos
      ports = portGroups[portsInput].ports.map(p => p.port);
      console.log(`\n${portsInput}: ${portGroups[portsInput].description}`);
    } else {
      // Si no, tratamos de interpretar como lista manual (ej: "80,443" o "1-100")
      ports = extractPortsFromStringToArray(portsInput);
    }
    try {
        if (!ports || ports.length === 0) {
    console.log("🚫 Escaneo cancelado: no se proporcionaron puertos válidos.");
    return; // 🔴 Esto detiene la función antes de escanear
}
        await scanPorts(ip, ports, timeout);
    } catch (err) {
        console.error("❗ [Error] al escanear:", err);
    }

};


async function scanPorts(networkAddress,ports,timeout) {// Escanea los puertos de la IP o Dominio (Direcciones de red).
    const now = new Date().toLocaleString();
         const ipAddress = await getIp(networkAddress); // Esperamos a que obtenerIP resuelva la IP antes de continuar

    const header = `\n🔍 Escaneando puertos de entrada en ${consoleStyles.text.orange} 🌐 ${ipAddress} ${consoleControl.resetStyle} con timeout de ${consoleStyles.text.orange}${timeout}${consoleControl.resetStyle} ms...\n`;
    console.log(header);
    logLines.push(header);


    for (const port of ports) {
        await checkPortStatus(networkAddress,port,timeout);
    }

    const footer = `\n🎯 Escaneo finalizado. ${now}\n\n${"=".repeat(50)}\n`;
    console.log(footer);
    logLines.push(footer);

    saveLogsToFile();


};


function checkPortStatus(ip,port,timeout = defaultTimeout) {// devuelve el estado del puerto de una IP Mediante una conexion TCP (ABIERTO,CERRADO, sin respuesta) 
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(timeout);

        socket.connect(port, ip, () => {  // <-- Aquí es donde se hace la conexión TCP. Si conecta, puerto abierto
            const msg = `✅ Puerto ${port} ABIERTO - ${knownPortsServices.find(p => p.port === port)?.name || "Desconocido"} → (puerto de salida local: ${socket.localPort})`;
            console.log(msg);
            logLines.push(msg);
            socket.destroy();
            resolve();
        });

        socket.on("error", () => {
            const msg = `❌ Puerto ${port} cerrado - ${knownPortsServices.find(p => p.port === port)?.name || "Desconocido"}`;
            console.log(msg);
            logLines.push(msg);
            resolve();
        });

        socket.on("timeout", () => {
            const msg = `⏱️ Puerto ${port} sin respuesta (timeout) - ${knownPortsServices.find(p => p.port === port)?.name || "Desconocido"}`;
            console.log(msg);
            logLines.push(msg);
            socket.destroy();
            resolve();
        });
    });
};






function extractPortsFromStringToArray(input) { //Extrae de un string los puertos y los retorna en un array (lista) de forma ordenada.
    const portList = [];
    if (!input) {
        console.error("❗ [Error]: Debes especificar los puertos a escanear. Ejemplo: '80,443' o '1-1024'");
        return []; // Devuelve array vacío para que no se escanee nada
    }

    const entries = input.split(",");
    for (const entry of entries) {
        if (entry.includes("-")) {
            const [start, end] = entry.split("-").map(Number);
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    portList.push(i);
                }
            }
        } else {
            const port = parseInt(entry);
            if (!isNaN(port)) portList.push(port);
        }
    }

    return portList.sort((a, b) => a - b); // Ordenar puertos
}



module.exports = { getPortsStatus, extractPortsFromStringToArray};