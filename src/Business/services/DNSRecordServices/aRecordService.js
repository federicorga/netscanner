const { companyName } = require("../../../Infrastructure/config/config.js");
const { getRegister } = require("../../../Infrastructure/repository/clients/api/DNSClient.js");
const { isCompanyIP, normalizeToArray } = require("../../../utils/utils.js");

//Raw (Respuesta cruda" o "Datos sin procesar") respuesta sin procesar del DNSClientq
//records ("Registros" o "Registros normalizados") es el valor que obtienes después de procesar y normalizar la respuesta raw. Es un array de objetos que contienen los registros DNS de tipo A
// result ("Resultado") es el objeto final que se retorna desde tu función getARecord. Este objeto contiene tanto la respuesta raw (en forma procesada) como los registros records dentro de una estructura más amigable y útil para los usuarios de tu API o función.

async function getARecord(domain) { //devuelve los registros A de un dominio en un array de objetos {name, type, TTL, data} mas informacion

    try{
    const raw = await getRegister(domain, "A"); // Obtiene todos los registros A del dominio sin procesar y se encarga de la normalizacion de los datos.

    if (!raw.success) {
    
    return raw // Si hubo un error, retorna el objeto de error tal cual aunque no es un error es una advertencia;
    }

    const records = await normalizeToArray(raw.data.Answer); // Normaliza a array los registros A siempre, si no devuelve []

    return{ // Resultado final Nuevo objeto que incluye tanto la respuesta raw como los registros normalizados
        success: raw.success,
        message: raw.message,
        data: records, // Registros en Array de objetos normalizado {name, type, TTL, data}
        error: raw.error,
        meta: raw.meta
    };

    /* otra forma de devolverlo es esta ya que solo se modifica el data es con los 3 puntos ... trae todo el objeto y permite modificar
    lo que se necesita de el poniendo abajo la parte del objeto

    return {
    ...raw,
    data:recrods
    }

    */
    
 
} catch(err){
   
        throw new Error(`${err.message}`)
    
};

}

async function aLookupService(domain) {
    
    let isCompany = false;
    let ipEncontrada = null;

    const result = await getARecord(domain);
   
    if (!result.success) {
        return result // Se envia asi ya que no es un error es una advertencia.
        //Solo se envia el mensaje y el success=false
    }

    for (const record of result.data) { // Recorro todos los registros A encontrados
        const ip = record.data || record.address;
        if (ip && isCompanyIP(ip)) {
            isCompany = true;
            ipEncontrada = ip;
            break;

        }
    }

    if (isCompany) {
        return {
            success: {...result.success, isCompany},
            message: `El dominio ${domain} tiene alojado su servicio o recurso en ${companyName}.`,
            data: result.data,
            error: null,
            meta: { ...result.meta, baseMessage: result.message },
        };
    }

    return {
        success: {...result.success, isCompany},
        message: `El dominio ${domain} no parece estar alojado en ${companyName}.`,
        data: result.data, // Devuelvo todas las IPs para referencia
        error: null,
        meta: { ...result.meta, baseMessage: result.message },
    };
}

module.exports = { aLookupService };
