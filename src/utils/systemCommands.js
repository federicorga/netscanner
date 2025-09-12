const { exec } = require('child_process'); // Para ejecutar comandos de sistema
const { logo } = require('./logoCMD');



const consoleStyles = { // Estilos de consola
  text: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    mustard:"\x1b[38;5;214m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
     // Colores extendidos
  orange: "\x1b[38;5;208m",       // naranja fuerte
  lightBlue: "\x1b[38;5;117m",    // celeste claro
  gray: "\x1b[38;5;245m",         // gris medio
  pink: "\x1b[38;5;213m",         // rosa
  lightGreen: "\x1b[38;5;119m",   // verde claro
  lightCyan: "\x1b[38;5;159m",    // cyan claro
  },
  background: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
     // Colores extendidos
  orange: "\x1b[38;5;208m",       // naranja fuerte
  lightBlue: "\x1b[38;5;117m",    // celeste claro
  gray: "\x1b[38;5;245m",         // gris medio
  pink: "\x1b[38;5;213m",         // rosa
  lightGreen: "\x1b[38;5;119m",   // verde claro
  lightCyan: "\x1b[38;5;159m",    // cyan claro
  },
  style: {
    bold: "\x1b[1m",
    underline: "\x1b[4m",
    inverse: "\x1b[7m"
  },
};

const consoleControl={ // Comandos de control de consola
  resetStyle: "\x1b[0m", // Resetea todos los estilos
  clear: "\x1b[2J\x1b[0;0H", // Limpia la consola y mueve el cursor a la posición inicial
  resetConsole: "\x1Bc" // Resetea la consola
}


// Helpers centralizados
function formatMessage(message) {
  return `\n${consoleStyles.text.lightBlue}${message}${consoleControl.resetStyle}`;
}

function formatSuccess(message) {
  return `\n${consoleStyles.text.green}✅ [OK] ${message}${consoleControl.resetStyle}`;
}

function formatError(message) {
  return `\n${consoleStyles.text.red}❗ [Error] ${message}${consoleControl.resetStyle}`;
}

function formatRequest(message) { //
  return `\n${consoleStyles.text.lightBlue}${message}${consoleControl.resetStyle}`;
}

function formatNotFound(message) {
  return `\n${consoleStyles.text.gray}❌ [Not found] ${message}${consoleControl.resetStyle}`;
}


function formatWarning(message) {
  return `\n${consoleStyles.text.yellow}⚠️ [Warning] ${message}${consoleControl.resetStyle}`;
}


function formatMessage(type, message) {
    switch (type) {
        case "success":
            return formatSuccess(message);
        case "error":
            return formatError(message);
        case "warning":
            return formatWarning(message);
        case "not_found":
            return formatNotFound(message);
        case "request":
            return formatRequest(message);
        default:
            return message;
    }
}

function clearConsole() {//Limpia la consola dependiendo del sistema operativo
  if (process.platform === 'win32') {
    exec('cls', (err, stdout, stderr) => {
      if (err) {
        console.error(formatError("No se pudo limpiar la consola"), err);
        return;
      }
      process.stdout.write(consoleControl.resetConsole);  // Enviar código de escape para borrar la consola
      console.log(logo); 
    });
  } else {
    process.stdout.write(consoleControl.resetConsole);  // Enviar código de escape para borrar la consola
    console.log(logo); 
  }
};

module.exports={clearConsole,consoleStyles,consoleControl,formatMessage};