const { exec } = require('child_process'); // Para ejecutar comandos de sistema
const os = require('os');

async function pingHost(ipOrDomain) { // Función para hacer ping a una IP o dominio de forma asíncrona

  
    const pingCommand = os.platform() === 'win32' ? `ping ${ipOrDomain} -n 4` : `ping ${ipOrDomain} -c 4`; // Detecta si es Windows o Unix/Linux/Mac
   
  
    try {
    
        return new Promise((resolve, reject) => {
            exec(pingCommand, (error, stdout, stderr) => {
                if (error) {
                    reject(`${error.message}`);
                    return;
                }
                if (stderr) {
                    reject(`stderr: ${stderr}`);
                    return;
                }
                resolve(stdout); // Devuelve el resultado del ping
               
            });
       
        });
        
    } catch (error) {
        throw new Error(`No se pudo ejecución el ping: ${error.message}`);
    } 
  };



  module.exports = { pingHost};