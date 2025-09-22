const path = require("path"); 
const {knownPortsServices}= require("../../Infrastructure/config/portsConfig.js");






// Configurciones iniciales


const logFileName= "scan-log.txt";
const logFilePath= path.join(process.cwd(), "scan-log.txt"); //crea la ruta completa al archivo scan-log.txt en el mismo lugar desde donde ejecutás el programa
let logLines=[]; // Array para almacenar los resultados
const defaultTimeout= 4000;
const defaultPorts = knownPortsServices.map(service => service.port);

const companyName = "Wavenet";
const companyNameLower = companyName.toLowerCase();

const commands=[
  { id: 1, name: "help" },
  { id: 2, name: "exit" },
  { id: 3, name: "clear" },
  { id: 4, name: "provdns" },
  { id: 5, name: "ping" },
  { id: 6, name: "ip" },
  { id: 7, name: `ip${companyNameLower}` }, // Alias para ip
  { id: 8, name: "ipadm" },
  { id: 9, name: "ipinfo" },
  { id: 10, name: "whois" },
  { id: 11, name: "infos" },
  { id: 12, name: "ptr" },
  { id: 13, name: "a" },
  { id: 14, name: "mx" },
  { id: 15, name: "ns" },
  { id: 16, name: "cname" },
  { id: 17, name: "txt" },
  { id: 18, name: "spf" },
  { id: 19, name: "dkim" },
  { id: 20, name: "dmarc" },
  { id: 21, name: "ssl" },
  { id: 22, name: "serialss" },
  { id: 23, name: "portscan" },
  { id: 24, name: "-td" },
  {id: 25, name:"-f"},
  {id: 26, name: "checkdns" },
  { id: 27, name: "banner" }
]





module.exports = {
  logFileName,logFilePath,logLines,defaultTimeout,defaultPorts,companyName,companyNameLower,commands
 
  };