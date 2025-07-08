



const { getRegister } = require("../../src/clients/api/DNSClient.js");
const { getIpInfo } = require("../../src/clients/api/ipInfoClient.js");

const { isCompanyIP } = require("../../utils/utils.js");
const { consoleStyles } = require("../../utils/systemCommands.js");


async function getNsRecord(dominio) {
  try {
  

    const data= await getRegister(dominio, "NS");

 
    const domainOwner = await getIpInfo(dominio); // Obtenemos el propietario del dominio

    if (data.Answer) {
      let esWavenet = false;
      console.log(`\n✅ ${dominio} tiene registros NS:`, data.Answer);

      for (const ns of data.Answer) { // Verificamos cada registro NS
        const nsDomain = ns.data.toLowerCase(); // Extraemos el dominio NS

        // Ahora realizamos una consulta A para obtener la IP asociada a este servidor N
        const ipData= await getRegister(nsDomain, "A"); // Obtenemos el registro A del servidor NS

        if (ipData.Answer) {
          for (const ipRecord of ipData.Answer) {
            const ip = ipRecord.data;
            // Pasamos la IP a la función isCompanyIP
            if (isCompanyIP(ip)) {
              esWavenet = true;
              break;  // Si encontramos una IP de Wavenet, no es necesario seguir buscando
            }
          }
        }
      }

      if (esWavenet) {
        console.log(`\n🛰️✅ La gestión de los registros DNS del dominio ${dominio} ${consoleStyles.text.green} está a cargo de los servidores de Wavenet.`);
      } else {
       
        console.log(`\n🛰️❌ La gestión de los registros DNS del dominio ${dominio} no parece estar delegado a Wavenet.`);

        console.log(`\n🔍 Entidad que gestiona el dominio: \n${JSON.stringify(domainOwner, null, 2)}\n`);
       
       
      }

      return true;
    } else {
      console.log(`\n❌ No tiene registros NS para ${dominio}`);
      return false;
    }
  } catch (error) {
    console.error('\n❗[Error] al obtener los registros NS:', error);
    return false;
  }
}






  module.exports = { getNsRecord};