const { companyName } = require("../../config/config.js");
const { getRegister } = require("../../clients/api/DNSClient.js");
const { isCompanyIP,normalizeToArray } = require("../../utils/utils.js");

async function getARecord(dominio) {

    const response = await getRegister(dominio, "A");

    // Si getRegister falló
    if (!response.success) {
        return {
            success: false,
            message: `❗ Error al consultar registros A para ${dominio}`,
            data: null,
            error: response.error,
            meta: response.meta,
        };
    }




    if (response.length === 0) {
        return {
            success: false,
            message: `❌ No se encontró registro A para el dominio ${dominio}.`,
            data: null,
            error: response.error,
            meta: response.meta,
        };
    }

    let esWavenet = false;
    let ipEncontrada = null;

    const recrods= await normalizeToArray(response.data);


    for (const record of recrods) {
        const ip = record.data || record.address;
        if (ip && isCompanyIP(ip)) {
            esWavenet = true;
            ipEncontrada = ip;
            break;
        }
    }

    if (esWavenet) {

           
        return {
            success: true,
            message: `🛰️✅ El dominio ${dominio} tiene alojado su servicio o recurso en ${companyName}.`,
            data: response.data,
            error: null,
            meta: response.meta,
        };
    }

    return {
        success: false,
        message: `🛰️❌ El dominio ${dominio} no parece estar alojado en ${companyName}.`,
        data: response.data, // Devuelvo todas las IPs para referencia
        error: null,
        meta: response.meta,
    };
}


async function aLookupService (domain){
       const raw=  await getARecord(domain);

       const parsedData=normalizeToArray(raw.data);
      

         return {
    success: raw.success,
    message: raw.message,
    data: parsedData,
    error:raw.error
  };




}


module.exports = { aLookupService };