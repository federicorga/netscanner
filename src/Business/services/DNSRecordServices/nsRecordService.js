const { getRegister } = require("../../../Infrastructure/repository/clients/api/DNSClient.js");
const { isCompanyIP, getIp, normalizeToArray } = require("../../../utils/utils.js");
const { companyName } = require("../../../Infrastructure/config/config.js");



async function getNsRecord(dominio) {
  try {
    const raw = await getRegister(dominio, "NS");


    if (raw.success === false) {
      return {
        message: raw.message,
        success: raw.success,
      };
    }
    
     const records = await normalizeToArray(raw.data.Answer);
    
     return{
      success: raw.success,
      message: raw.message,
      data: records,
      error: raw.error,
      meta: raw.meta
     }

    
  } catch (err) {
    throw new Error(`${err.message}`)
  }
}

async function nsLookupService(domain) {


  let isCompany = false;
  let ipData = null;
  let messageVerification = "";

  const result = await getNsRecord(domain);

    if (result.success===false) {
        return result
    }

     for (const ns of result.data) 
      {
        
        const nsDomain = (ns.data || ns.ns || "").toLowerCase();

        if (!nsDomain) continue; // Evitar errores si no hay datos
     
        ipData= await getIp(nsDomain);
       
        if (!ipData) {
 
          return ipData
        }
      
        
          isCompany = isCompanyIP(ipData);          

        if(isCompany){
          return{
            success: {...result.success,isCompany},
            message:`La gestión/configuración de los registros DNS del dominio ${domain} está a cargo de ${companyName}.`,
            data: result.data,
            error: null,
            meta: {...result.meta,ip:ipData,baseMessage: result.message}
          }}
          else{
            return{
              success: {...result.success,isCompany},
              message:`La gestión/configuración de los registros DNS del dominio ${domain} no parece estar a cargo de ${companyName}.`,
              data: result.data,
              error: null,
              meta: {...result.meta,ip:ipData,baseMessage: result.message, messageVerification}
            }
          }
      }


  

}



  module.exports = { nsLookupService};
       







