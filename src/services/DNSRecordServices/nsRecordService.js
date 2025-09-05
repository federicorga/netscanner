const { getRegister } = require("../../clients/api/DNSClient.js");
const { getIpInfo } = require("../../clients/api/ipInfoClient.js");

const { isCompanyIP, getIp } = require("../../utils/utils.js");

const { companyName } = require("../../config/config.js");
const ip = require("../../commands/ip.js");


async function getNsRecord(dominio) {
  try {
    const data = await getRegister(dominio, "NS");
   let ipData;

    if (data.Answer) {
      let esWavenet = false;
      console.log(`\n✅ ${dominio} tiene registros NS:`, data.Answer);

      for (const ns of data.Answer) {
        const nsDomain = (ns.data || ns.ns || "").toLowerCase(); 

        if (!nsDomain) continue; // Evitar errores si no hay datos
          ipData= await getIp(nsDomain);
        if (ipData) {
          console.log(`\n🔍 Verificando NS: ${nsDomain} con IP: ${ipData}`);
            if (isCompanyIP(ipData)) {
              esWavenet = true;
              break;  
            }
           
        }
      }

      if (esWavenet) {
        console.log(`\n🛰️✅ La gestión/configuración de los registros DNS del dominio ${dominio} está a cargo de ${companyName}.`);
      } else {
        console.log(`\n🛰️❌ La gestión/configuración de los registros DNS del dominio ${dominio} no parece estar a cargo de ${companyName}.`);
        console.log(`\n🔍 Entidad que gestiona el dominio: \n${JSON.stringify(await getIpInfo(ipData),null,2)}\n`);
      }

      return true;
    } else {
      console.log(`\n❌ No se encontraron registros NS para el dominio: ${dominio}`);
      return false;
    }
  } catch (error) {
    console.error('\n❗[Error] al obtener los registros NS:', error);
    return false;
  }
}


  module.exports = { getNsRecord};
       







