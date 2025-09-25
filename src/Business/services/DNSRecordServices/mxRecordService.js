
const { companyName } = require('../../../Infrastructure/config/config.js');
const { getRegister } = require('../../../Infrastructure/repository/clients/api/DNSClient.js');
const { consoleStyles } = require('../../../Presentation/CLI/systemCommands.js');

const { getPtr, isCompanyIP, normalizeToArray } = require('../../../utils/utils.js');



const dnsp = require('dns').promises;

async function getMxRecord(domain) { // Devuelve los registros MX de un Dominio mediante API de GOOGLE
    try {
      
  const raw =  await getRegister(domain,"MX");


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
  };


  async function tracerMxMailServiceProvider(domain) {
  try {
    const registros = await dnsp.resolveMx(domain);

    const trace = []; // Array de pasos/traza se almacena el texto
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

  

    return {
      success: true,
  
      domain,
      trace, // Aquí está toda la traza
    };

  } catch (error) {
    return {
      success: false,
     
      domain,
      trace: [{ type: "error", message: `No se puede rastrear el registro MX: ${error.message}` }],
      error,
    };
  }
}



  async function mxLookupService (domain){

    let isCompany = false;
    let ipData = null;

    const mxRecord= await getMxRecord(domain);

    

    if (!mxRecord.success) {
      return mxRecord // Se envia asi ya que no es un error es una advertencia.
      //Solo se envia el mensaje y el success=false
  }

  if (isCompany) {
    trace.push({ type: "success", message: `\n🛰️✅ El servicio de correo está gestionado por ${companyName}.` });
  } else {
    trace.push({ type: "warning", message: `\n🛰️❌ El servicio de correo no parece estar gestionado por ${companyName}.` });
  }

    const mxTracer=await tracerMxMailServiceProvider(domain);

    return{
    mxRecord,
    mxTracer
    }

  }



  module.exports={mxLookupService};