const { getRegister } = require("../../../Infrastructure/repository/clients/api/DNSClient.js");
const { normalizeToArray } = require("../../../utils/utils.js");


async function getCNAMERecord(dominio) {
    try {
        
        const raw = await getRegister(dominio, "CNAME");

        if (!raw.success) {
    
        return {
        message:raw.message,
        success:raw.success
        }; 
        }
        

        const records = await normalizeToArray(raw.data.Answer);
 return{ 
        success: raw.success,
        message: raw.message,
        data: records,
        error: raw.error,
        meta: raw.meta
    };
    
 
} catch(err){
   
        throw new Error(`${err.message}`)
    
};
       
      
  };


  async function CNAMELookupService(domain) {

    const result = await getCNAMERecord(domain);

    
 if (!result.success) {
    return{
        success: result.success,
        message: `No se encontro registro CNAME para el dominio: ${domain}`,
        data: result.data, // Devuelvo todas las IPs para referencia
        error: null,
        meta: { ...result.meta, baseMessage: result.message },
    }
    }

        return {
            success: result.success,
            message: (`El dominio ${domain}tiene registros CNAME:`, result.data.Answer),
            data: result.data,
            error: null,
            meta: { ...result.meta, baseMessage: result.message },
        };

    
  }


  module.exports = { CNAMELookupService};


  