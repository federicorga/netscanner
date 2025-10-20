
const net = require('net');
const { getPtr } = require('../../../Infrastructure/network/dnsAdapter');


  async function getPtrRecord(ip) {
    try {
            // Validar si es una IP; si no lo es, resolvemos primero la IP del dominio
     if(ip === null || ip.trim() ===""){
       throw new Error ("La entrada no puede estar vacía.");
    
     }

     const hostnames= await getPtr(ip);
     
      if (hostnames.length > 0) {
        const hostname = hostnames[0];
  
        // Extraer dominio asociado
        /*
        const parts = hostname.split(".");
        let dominioAsociado = hostname;
        if (parts.length >= 3) {
          dominioAsociado = parts.slice(-3).join("."); // ejemplo: midominio.com
        }*/
  
        return `\n🔁 PTR de ${ip}: \n🖥️ Hostname: ${hostname}\n`;
      } else {
        return "\n🚫 No tiene PTR asociado.";
      }
    } catch (err) {

       throw new Error (`No se pudo resolver PTR para ${ip}: ${err.message}`);
    }
  }



  module.exports = { getPtrRecord};