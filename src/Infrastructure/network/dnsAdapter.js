const dns = require("dns");
const net = require('net');
async function getIp(domain) { // Función para obtener la IP de un dominio
  try{
    return new Promise((resolve, reject) => {
        const isIp = net.isIP(domain); // 4 para IPv4, 6 para IPv6, 0 si no es IP
           if (isIp) {
            resolve(domain); // Si es una IP, la devolvemos tal cual.
        } else {
          dns.lookup(domain, (err, address) => {  // Esto es un callback  (err, address) => { ... }
            if(err){
              return reject(`No se pudo resolver el dominio: ${err.message}`);       
            }      
          resolve(address); // Devolver la IP si se encuentra
          });
        }
    });
  } catch (error) {

     throw new Error(`No se puedo resolver la IP: ${error.message}`);
  };
};


async function getPtr(ip) { // Función para obtener el PTR (hostname) de una IP mediante DNS-INVERSO
    const esIp = await isIp(ip);
    if (!esIp) {
      ip = await getIp(ip);
    }
  
    try {
      const hostnames = await dns.promises.reverse(ip);
      return hostnames;
    } catch (error) {
      if (error.code === "ENOTFOUND" || error.code === "EAI_AGAIN") {
        // Sin PTR configurado o error DNS transitorio
        return [];
      }
      throw error; // Otros errores, los relanzamos
    }
  };

  async function isIp(ip){

    const esIp = net.isIP(ip);
    if (!esIp) {
     return false;
    }

    return true;
  };
  


module.exports={ getIp, getPtr};