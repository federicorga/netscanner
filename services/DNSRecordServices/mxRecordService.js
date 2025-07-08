const {getRegister} = require('../../src/clients/api/DNSClient.js');
const { companyName } = require('../../config/config.js');
const { isCompanyIP, getPtr } = require('../../utils/utils.js');
const { consoleStyles } = require('../../utils/systemCommands.js');

const dnsp = require('dns').promises;

async function getMxRecord(dominio) { // Devuelve los registros MX de un Dominio mediante API de GOOGLE
    try {
      
      const data =  await getRegister(dominio,"MX");
  
      if (data.Answer) {
        console.log(`\n✅ ${dominio} tiene registros MX:`, data.Answer);
        return true;
      } else {
        console.log(`\n❌ ${dominio} no tiene registros MX.`);
        return false;
      }
    } catch (error) {
      console.error(`\n❗[Error] al consultar los MX para ${dominio}:`, error);
      return false;
    }
  };


  
  async function tracerMxMailServiceProvider(dominio) { //Rastrea el proveedor de servicios de correo electrónico asociado con un dominio, utilizando los registros MX (Mail Exchange) de DNS.
    try {
      const registros = await dnsp.resolveMx(dominio);
      console.log(`\n🧭 Analizando destino de MX para ${dominio}:`);
  
      let isCompany = false;  // Variable para determinar si el registro es de la empresa
  
      for (const mx of registros) {
        console.log(`➡️  ${mx.exchange} (prioridad ${mx.priority})`);
  
        try {
          const ips = await dnsp.resolve4(mx.exchange);
          for (const ip of ips) {
            console.log(`🌐 IP: ${ip}`);
            try {
              const ptr = await getPtr(ip); // Obtener el registro PTR
              console.log(`🔁 PTR: ${ptr.join(', ')}`);
              
              // Verificar si el PTR contiene "la empresa"
              if (isCompanyIP(ip)) {
                isCompany = true;  // Marcar que está gestionado por la empresa
              }
            } catch (err) {
              console.log(`⚠️ Sin PTR: ${err.message}`);
            }
          }
        } catch (err) {
          console.log(`⚠️ No se pudo resolver IP para ${mx.exchange}: ${err.message}`);
        }
      }

      // Si se detectó que es de la empresa, lo notificamos al final
      if (isCompany) {
        console.log(`\n🛰️✅ El servicio de correo ${consoleStyles.text.green} esta gestionado por ${companyName}.`);
      }else {
        console.log(`\n🛰️❌ El servicio de correo no parece estar gestionado por ${companyName}.`);
      }
  
    } catch (error) {
      console.error(`❗[Error] al rastrear MX de ${dominio}:`, error.message);
    }
  }



  module.exports={getMxRecord,tracerMxMailServiceProvider};