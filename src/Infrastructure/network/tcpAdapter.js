// conexiones TCP o net
const net = require('net');

function isPortOpen  (ip,port,timeout=defaultTimeout) { //verifica si el puerto esta abierto o cerrado mediante una conexion TCP y devuelve true o false
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(timeout);

      socket.connect(port, ip, () => {
        resolve(true);
        socket.destroy();
      });

      socket.on("error", () => {
        resolve(false);
      });
    });
  };


  function grabBanner(ip, port, timeout = 3000) {
  return new Promise((resolve) => {
    let banner = '🟢 '; // aqui se almacena el baner extraido de el puerto escaneado 
    const socket = new net.Socket();

    socket.setTimeout(timeout);

    

    socket.connect(port, ip, () => {
      // Conexión establecida, esperar data
    });

    socket.on('data', (data) => {
      banner += data.toString();
      socket.destroy(); // cerrar después de recibir algo
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(`⏱️ Timeout (${port})`);
    });

    socket.on('error', (err) => {
      resolve(`❌ Error - (${port}): ${err.message}`);
    });

    socket.on('close', () => {
      resolve(banner.trim() || `✅ Connected (${port}) - sin banner`);
    });
  });
}




module.exports={isPortOpen,grabBanner};