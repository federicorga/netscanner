//conexiones TLS/SSL cifrada de bajo nivel
//si estás haciendo una conexión directa TLS (tls.connect()) sin protocolo

const tls = require('tls');


function connectionTLS(host, port ,validationConnect=true) {// Esta función establece la conexión TLS y retorna el socket
    return new Promise((resolve, reject) => {
      const socket = tls.connect({
        host,
        port,
        servername: host,  // SNI (Server Name Indication)
        rejectUnauthorized: validationConnect, // Validación del certificado verdadera por defecto para conexiones seguras.
        timeout: 5000, // Timeout de 5 segundos
      }, () => {
        resolve(socket); // Retorna el socket una vez que la conexión se ha establecido
      });
  
      socket.on('error', (err) => {
        reject(`Problema al realizar la conexión TLS: ${err.message}`);
      });
  
      socket.setTimeout(5000, () => {
        socket.destroy();
        reject('Timeout en la conexión TLS');
      });
    });
  };


  async function getRawSSLCertificate(host, port) { //conecta y obtiene el certificado en bruto.
    return new Promise((resolve, reject) => {
      const socket = tls.connect({
        host,
        port,
        servername: host,
        rejectUnauthorized: false,
        timeout: 5000
      }, () => {
        try {
          const cert = socket.getPeerCertificate(true); //el servidor remoto con el que estás haciendo la conexión TLS. El argumento true indica que quieres la cadena completa de certificados 
          if (!cert || !cert.raw) {  
            reject("No se pudo obtener el certificado (raw)");
            socket.end();
            return;
          }
  
          const valid = socket.authorized;
          const reasons = socket.authorized ? socket.authorizationError :"Desconocido";
     // Crear un nuevo objeto que contenga el certificado y los datos de validación
          const certWithValidation = {
            ...cert, // Usar el operador de propagación para copiar todas las propiedades del certificado original
            valid,
            reasons
          };
        
          resolve(certWithValidation);
          socket.end();
        } catch (e) {
          reject("No se pudo obtener certificado: " + e.message);
          socket.end();
        }
      });
  
      socket.on('error', (err) => {
        reject(`NO se puede conectar por SSL: ${err.message}`);
      });
  
      socket.setTimeout(5000, () => {
        socket.destroy();
        reject("Timeout en conexión SSL");
      });
    });
  };
  


module.exports={getRawSSLCertificate,connectionTLS};