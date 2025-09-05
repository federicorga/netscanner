

const dns = require('dns').promises;



async function getDMARCRecord(domain) {
    try {
        const dmarcDomain = `_dmarc.${domain}`;
        const records = await dns.resolveTxt(dmarcDomain);


        if (!records) {
            return {
                success: false,
                message: `No se encontró registro DMARC para el dominio: ${domain}`,
                data: null,
                error: { code: 404, detail: 'Registro DMARC no existe' }
            };
        }

        
        // Buscamos el registro DMARC válido
        const dmarcRecord = records
            .map(r => r.join(''))
            .find(txt => txt.startsWith('v=DMARC1'));

        // Si se encontró el registro
        return {
            success: true,
            message: `Se encontró registro DMARC para el dominio: ${domain}`,
            data: dmarcRecord ,
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

function parseDMARCRecord(record) {
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
  const raw = await getDMARCRecord(domain);

  const objectDMARC = parseDMARCRecord(raw.data); // Convierte el TXT DMARC en un array de objetos {Campo, Valor, Descripcion}

    return {
    success: raw.success,
    message: raw.message,
    data: objectDMARC, 
    error:raw.error
  };
}

module.exports = { DMARCRecordService };

