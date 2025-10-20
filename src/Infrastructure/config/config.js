const path = require("path"); 
const {knownPortsServices}= require("../../Infrastructure/config/portsConfig.js");


// Configurciones iniciales

const logFileName= "scan-log.txt";
const logFilePath= path.join(process.cwd(), "scan-log.txt"); //crea la ruta completa al archivo scan-log.txt en el mismo lugar desde donde ejecutás el programa
let logLines=[]; // Array para almacenar los resultados
const defaultTimeout= 4000;
const defaultPorts = knownPortsServices.map(service => service.port);
commands = []; // Array para almacenar los comandos disponibles
const companyName = "Wavenet";
const companyNameLower = companyName.toLowerCase();


module.exports = {
  logFileName,logFilePath,logLines,defaultTimeout,defaultPorts,companyName,companyNameLower,commands
 
  };