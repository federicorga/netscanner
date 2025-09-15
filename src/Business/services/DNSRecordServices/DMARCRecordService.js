

const dns = require('dns').promises;



async function getDMARCRecord(domain) {
    try {
        const dmarcDomain = `_dmarc.${domain}`;

        const raw = await getRegister(dmarcDomain, "TXT"); // Obtiene todos los TXT del subdominio sin procesar 


        if (!raw) {
            return {
                success: false,
                message: `No se encontró registro para el dominio: ${domain}`,
                data: null,
                error: { code: 404, detail: 'Registro DMARC no existe' }
            };
        }

        
      // Buscar el registro que comienza con "v=DMARC1"
        const dmarcData = raw 
            .map(r => r.join(''))
            .find(txt => txt.startsWith('v=DMARC1'));

        if(!dmarcData){
            return {
                success: false,
                message: `No se encontró registro DMARC para el dominio: ${domain}`,
                data: null,
                error: { code: 404, detail: 'Registro DMARC no existe' }
            };
        }    

        // Si se encontró el registro
        return {
            success: true,
            message: `Se encontró registro DMARC para el dominio: ${domain}`,
            data: dmarcData ,
            error: null
        };

    } catch (err) {
        // Error de DNS o inesperado
        return {
            success: false,
            message: `No se pudo consultar el registro DMARC para el dominio: ${domain}`,
            data: null,
            error: { code: 500, detail: err.message }
        };
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
  const raw = await getDMARCRecord(domain); // Obtiene el TXT DMARC

  const objectDMARC = parseDMARC(raw.data); // Convierte el TXT DMARC en un array de objetos {Campo, Valor, Descripcion}

    return {
    success: raw.success,
    message: raw.message,
    data: objectDMARC, 
    error:raw.error
  };
}

module.exports = { DMARCRecordService };

