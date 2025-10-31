const { exec } = require('child_process');
const os = require('os');

async function tracerouteHost(ipOrDomain) {

 

  // Comando dependiendo del SO
  // Windows usa 'tracert', Linux/Mac usa 'traceroute'
  const tracerouteCommand = os.platform() === 'win32'
    ? `tracert ${ipOrDomain}`
    : `traceroute ${ipOrDomain}`;

  try {
    return new Promise((resolve, reject) => {
      exec(tracerouteCommand, (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          reject(`stderr: ${stderr}`);
          return;
        }
        resolve(stdout);
      });
    });
  } catch (error) {
    throw new Error(`No se pudo ejecutar traceroute: ${error.message}`);
  }
}

module.exports = { tracerouteHost };
