



const { getRegister } = require("../../src/clients/api/DNSClient.js");
const { getIpInfo } = require("../../src/clients/api/ipInfoClient.js");

const { isCompanyIP } = require("../../utils/utils.js");

const { companyName } = require("../../config/config.js");


async function getNsRecord(dominio) {
  try {
    const data = await getRegister(dominio, "NS");
    const domainOwner = await getIpInfo(dominio);

    if (data.Answer) {
      let esWavenet = false;
      console.log(`\n✅ ${dominio} tiene registros NS:`, data.Answer);

      for (const ns of data.Answer) {
        const nsDomain = (ns.data || ns.ns || "").toLowerCase();

        if (!nsDomain) continue; // Evitar errores si no hay datos

        const ipData = await getRegister(nsDomain, "A");

        if (ipData.Answer) {
          for (const ipRecord of ipData.Answer) {
            const ip = ipRecord.data || ipRecord.address;
            if (isCompanyIP(ip)) {
              esWavenet = true;
              break;
            }
          }
        }
      }

      if (esWavenet) {
        console.log(`\n🛰️✅ La gestión/configuración de los registros DNS del dominio ${dominio} está a cargo de ${companyName}.`);
      } else {
        console.log(`\n🛰️❌ La gestión/configuración de los registros DNS del dominio ${dominio} no parece estar a cargo de ${companyName}.`);
        console.log(`\n🔍 Entidad que gestiona el dominio: \n${JSON.stringify(domainOwner, null, 2)}\n`);
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