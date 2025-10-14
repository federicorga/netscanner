const { exec } = require('child_process'); // Para ejecutar comandos de sistema
const os = require('os');

async function pingHost(ipOrDomain) { // Función para hacer ping a una IP o dominio de forma asíncrona
    const stdouta = process.stdout; // Limpiamos la línea de salida
    stdouta.write("⏳ Comprobando latencia con ping..."); // Mensaje de espera
  
    const pingCommand = os.platform() === 'win32' ? `ping ${ipOrDomain} -n 4` : `ping ${ipOrDomain} -c 4`; // Detecta si es Windows o Unix/Linux/Mac
   
  
    try {
    
        return new Promise((resolve, reject) => {
            exec(pingCommand, (error, stdout, stderr) => {
              stdouta.clearLine(0); // Limpia la línea
              stdouta.cursorTo(0);  // Mueve el cursor al inicio
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