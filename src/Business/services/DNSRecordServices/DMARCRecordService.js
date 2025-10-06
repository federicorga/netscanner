const { getRegister } = require("../../../Infrastructure/repository/clients/api/DNSClient");

async function getDMARCRecord(domain) {
    try {
    const dmarcDomain = `_dmarc.${domain}`;
    const raw = await getRegister(dmarcDomain, "TXT"); // Obtiene todos los TXT del subdominio sin procesar 
        
    if (!raw.success) {
    
    return raw 
  }


      // Buscar el registro que comienza con "v=DMARC1"
       const dmarcData = raw.data.Answer.map(r => r.data.trim()).find(txt => txt.startsWith('v=DMARC1'));
       


        if(!dmarcData){
            return {
                success: false,
                message: `No se encontró registro DMARC para el dominio: ${domain}`,
                data: null,
                error: 'Registro DMARC no existe',
                meta: raw.meta
            };
        }    

        // Si se encontró el registro
        return {
            success: true,
            message: `Se encontró registro DMARC para el dominio: ${domain}`,
            data: dmarcData ,
            error: null,
            meta: raw.meta
        };

    } catch (err) {

       throw new Error(`${err.message}`)
    }
}

function parseDMARC(record) { 

   if (!record) return []; // <-- Si no hay registro, devolvemos array vacío
  const dmarcDescriptions = {
    v: 'Versión del protocolo DMARC, siempre "DMARC1".',
    p: {
      none: 'Solo monitorea sin acción.',
      quarantine: 'Pone en cuarentena (ej. SPAM).',
      reject: 'Rechaza el correo directamente.'
    },
    rua: 'Dirección de correo para reportes agregados (estadísticas).',
    ruf: 'Dirección de correo para reportes forenses (detalles de fallas).',
    fo: {
      '0': 'Reporta solo si fallan SPF y DKIM.',
      '1': 'Reporta si falla cualquiera (SPF o DKIM).',
      d: 'Reporta si falla la firma DKIM.',
      s: 'Reporta si falla la validación SPF.'
    }
  };

  return record.split(';').map(part => {
    const [key, value = ''] = part.trim().split('=');

    let descripcion = dmarcDescriptions[key];
    if (typeof descripcion === 'object') {
      // Convertir objeto a string legible
      descripcion = Object.entries(descripcion)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }

    return {
      Campo: key,
      Valor: value,
      Descripcion: descripcion || 'Parámetro no reconocido',
    };
  }).filter(p => p.Campo); // eliminar campos vacíos
};


async function DMARCRecordService(domain) { 

  const result = await getDMARCRecord(domain); // Obtiene el TXT DMARC

  const objectDMARC = parseDMARC(result.data); // Convierte el TXT DMARC en un array de objetos {Campo, Valor, Descripcion}

    return {
    success: result.success,
    message: result.message,
    data: objectDMARC, 
    error:result.error,
    meta: result.meta
  };
}

module.exports = { DMARCRecordService };

