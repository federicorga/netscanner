const { companyName } = require("../../config/config.js");
const { getRegister } = require("../../clients/api/DNSClient.js");
const { isCompanyIP, normalizeToArray } = require("../../utils/utils.js");

async function getARecord(dominio) {

    try{
    const response = await getRegister(dominio, "a");

    // Si getRegister falló
     if (!response.success) {
        return response; // ya tiene message y error
    }
    

    if (
        !response.data ||
        !response.data.Answer ||
        response.data.Answer.length === 0
    ) {
        return {
            success: false,
            message: `No se encontró registro A para el dominio ${dominio}.`,
            data: null,
            error: null,
            meta: response.meta,
        };
    }

    return {
        success: true,
        message: `Se encontro registro A para el dominio ${dominio}.`,
        data: response.data,
        error: null,
        meta: response.meta,
    };
} catch(err){
    return {
        success: false,
        message: err.message,
        data: null,
        error: err.message || err,
        meta: { domain: dominio, type: "A" },
    };
}
}

async function aLookupService(domain) {
    let esWavenet = false;
    let ipEncontrada = null;

    const raw = await getARecord(domain);

    // Si la consulta falló, devuelvo el error tal cual
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
