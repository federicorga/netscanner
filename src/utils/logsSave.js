const fs = require("fs");
const { logFilePath, logLines } = require("../config/config.js");



function saveLogsToFile(logFile = logFilePath, lines = logLines) { //guarda líneas de log en un archivo de texto
  fs.appendFileSync(logFile, lines.join("\n") + "\n", "utf8");
  console.log(`📁 Resultados agregados a: ${logFile}`);
}

module.exports = { saveLogsToFile };