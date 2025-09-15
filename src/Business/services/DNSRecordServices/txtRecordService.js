const { getRegister } = require("../../../Infrastructure/repository/clients/api/DNSClient.js");
const { normalizeToArray } = require("../../../utils/utils.js");


async function getTXTRecords(domain) { // Función para obtener registros TXT de un dominio
 
    try{
    const raw = await getRegister(domain, "TXT"); // Obtiene todos los registros A del dominio sin procesar

    if (!raw.success) {
    
    return {
    message:raw.message,
    success:raw.success
    }; // Si hubo un error, retorna el objeto de error tal cual aunque no es un error es una advertencia;
    }


    const records = await normalizeToArray(raw.data.Answer); // Normaliza a array los registros A siempre, si no devuelve []

    return{ // Resultado final Nuevo objeto que incluye tanto la respuesta raw como los registros normalizados
        success: raw.success,
        message: raw.message,
        data: records, // Registros en Array de objetos normalizado {name, type, TTL, data}
        error: raw.error,
        meta: {...raw.meta,baseMessage:raw.message} //
    };
    
 
} catch(err){
   
        throw new Error(`${err.message}`)
    
};
}

module.exports = { getTXTRecords };