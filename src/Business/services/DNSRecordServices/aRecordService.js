const { companyName } = require("../../../Infrastructure/config/config.js");
const { getRegister } = require("../../../Infrastructure/repository/clients/api/DNSClient.js");
const { isCompanyIP, normalizeToArray } = require("../../../utils/utils.js");

async function getARecord(domain) {

    try{
    const response = await getRegister(domain, "A"); //si falla va al catch  
   
    if (
        !response.data ||!response.data.Answer ||response.data.Answer.length === 0) 
    {
        return {
            success: response.success,
            message: response.message,
            data: response.data,
            error: response.error,
            meta: response.meta,
        };
    }

    return {
        success: response.success,
        message:response.message,
        data: response.data,
        error: response.error,
        meta: response.meta,
    };
} catch(err){
   
        throw new Error(`${err.message}`)
    
}
}

async function aLookupService(domain) {
    let esWavenet = false;
    let ipEncontrada = null;

    const raw = await getARecord(domain);
  
    if (!raw.success) {
        return raw;
    }

    const records = await normalizeToArray(raw.data.Answer);

    for (const record of records) {
        const ip = record.data || record.address;
        if (ip && isCompanyIP(ip)) {
            esWavenet = true;
            ipEncontrada = ip;
            break;
        }
    }

    if (esWavenet) {
        return {
            success: {...raw.success, esWavenet},
            message: `El dominio ${domain} tiene alojado su servicio o recurso en ${companyName}.`,
            data: records,
            error: null,
            meta: { ...raw.meta, baseMessage: raw.message },
        };
    }

    return {
        success: {...raw.success, esWavenet},
        message: `El dominio ${domain} no parece estar alojado en ${companyName}.`,
        data: records, // Devuelvo todas las IPs para referencia
        error: null,
        meta: { ...raw.meta, baseMessage: raw.message },
    };
}

module.exports = { aLookupService };
