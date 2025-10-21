const { getRegister } = require("../../../Infrastructure/repository/clients/api/DNSClient.js");
const { normalizeToArray } = require("../../../utils/utils.js");


async function getCNAMERecord(dominio) {
    try {
        
        const raw = await getRegister(dominio, "CNAME");

        if (!raw.success) {
    
        return raw;

        }
        

        const records = await normalizeToArray(raw.data.Answer);
 return{ 
    ...raw,
        data: records,
    };
    
 
} catch(err){
   
        throw new Error(`${err.message}`)
    
};
       
      
  };


  async function CNAMELookupService(domain) {

    const result = await getCNAMERecord(domain);

    
 if (!result.success) {
    return{
      ...result,
        message: `No se encontro registro CNAME para el dominio: ${domain}`,
        meta: { ...result.meta, baseMessage: result.message },
    }
    }

        return {
            ...result,
            message: (`El dominio ${domain}tiene registros CNAME:`, result.data.Answer),
            meta: { ...result.meta, baseMessage: result.message },
        };

    
  }


  module.exports = { CNAMELookupService};


  