
const { getPtr, getIp } = require('../../../utils/utils.js');
const net = require('net');


  async function getPtrRecord(ip) {
    try {
            // Validar si es una IP; si no lo es, resolvemos primero la IP del dominio


     const hostnames= await getPtr(ip);

     const esIp = net.isIP(ip);
        if (!esIp) {
          ip = await getIp(ip);
        }

    
     
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
        return "🔍 No tiene PTR asociado.";
      }
    } catch (err) {
      return `❗[Error] No se pudo resolver PTR para ${ip}: ${err.message}`;
    }
  }



  module.exports = { getPtrRecord};