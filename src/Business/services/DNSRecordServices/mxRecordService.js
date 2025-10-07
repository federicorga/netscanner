
const { companyName } = require('../../../Infrastructure/config/config.js');
const { getRegister } = require('../../../Infrastructure/repository/clients/api/DNSClient.js');
const { getPtr, isCompanyIP, normalizeToArray } = require('../../../utils/utils.js');



const dnsp = require('dns').promises;

async function getMxRecord(domain) {

    try {
      
  const raw =  await getRegister(domain,"MX");


    if (!raw.success) {
      return raw;
    }
    
    
     const records = await normalizeToArray(raw.data.Answer);
    
     return{
     ...raw,
      data: records,
     }

    
  } catch (err) {
    throw new Error(`${err.message}`)
  }
  };


  async function tracerMxMailServiceProvider(domain) {
  try {
    const registros = await dnsp.resolveMx(domain);

    const trace = []; // Array de pasos/traza
    trace.push({ type: "info", message: `🧭 Analizando destino de MX para ${domain}:` });

    let isCompany = false;

    for (const mx of registros) {
      trace.push({ type: "mx", message: `➡️  ${mx.exchange} (prioridad ${mx.priority})` });

      try {
        const ips = await dnsp.resolve4(mx.exchange);

        for (const ip of ips) {
          trace.push({ type: "ip", message: `🌐 IP: ${ip}` });

          try {
            const ptr = await getPtr(ip);
            trace.push({ type: "ptr", message: `🔁 PTR: ${ptr.join(', ')}` });
          } catch (err) {
            trace.push({ type: "error", message: `⚠️ Sin PTR: ${err.message}`, ip });
          }


          if (isCompanyIP(ip)) {
            
            isCompany = true;
          }
        }
      } catch (err) {
        trace.push({ type: "error", message: `⚠️ No se pudo resolver IP para ${mx.exchange}: ${err.message}`, exchange: mx.exchange });
      }
    }

    // Mensaje final sobre la empresa
    if (isCompany) {
       message= `El servicio de correo está gestionado por ${companyName}.` ;
    } else {
      message= `El servicio de correo no parece estar gestionado por ${companyName}.`;
    }

    return {
      success: {...true,isCompany},
      message,
      domain,
      trace, // Aquí está toda la traza
    };

  } catch (error) {
    return {
      success: false,
      isCompany: false,
      domain,
      trace: [{ type: "error", message: `NO se pudo rastrear MX: ${error.message}` }],
      error,
    };
  }
}


  async function mxLookupService (domain){


    const result = await getMxRecord(domain);
   
    if (!result.success) {
        return result 
      
    }

    const mxTrace= await tracerMxMailServiceProvider(domain); // El estado del mensaje es manejado por tracerMXMail

       return {
            success: mxTrace.success,
            message: mxTrace.message,
            data: result.data,
            error: (result.error||mxTrace.error),
            meta: { ...result.meta,mxTrace, baseMessage: result.message },
        };

}



  module.exports={getMxRecord,tracerMxMailServiceProvider,mxLookupService};