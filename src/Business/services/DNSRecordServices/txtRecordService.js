const { getRegister } = require("../../../Infrastructure/repository/clients/api/DNSClient.js");
const { normalizeToArray } = require("../../../utils/utils.js");


async function getTXTRecords(domain) { // Función para obtener registros TXT de un dominio
 
    try{
    const raw = await getRegister(domain, "TXT"); 

    if (!raw.success) return raw;
    
    const records = await normalizeToArray(raw.data.Answer); 

    return{ 
       ...raw,
        data: records, 
    };
    
 
} catch(err){
   
        throw new Error(`${err.message}`)
    
};
}

module.exports = { getTXTRecords };