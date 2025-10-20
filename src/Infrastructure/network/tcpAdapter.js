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




module.exports={isPortOpen};