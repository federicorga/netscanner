

const dns = require('dns').promises;

async function getSPFRecord(domain) {
  try{
    const records = await dns.resolveTxt(domain);
    
    if(!records){
      return {
                success: false,
                message: `No se encontró registro SPF para el dominio: ${domain}`,
                data: null,
                error: { code: 404, detail: 'Registro SPF no existe' }
            };
    }

    const spfRecords = records.map(txtArray => txtArray.join('')) // Unir fragmentos
      .filter(record => record.startsWith('v=spf1'));

    if (spfRecords.length === 0) return null;
    return{
      success:true,
      message:`Se encontró registro SPF para el dominio: ${domain}`,
      data: spfRecords,
      error:null 
    }


  } catch (error) {
    return {
      success: false,
      message: `No se pudo consultar el registro SPF para el dominio: ${domain}`,
      data: null,
      error: { code: 500, detail: error.message }
  }
}
};

function parseSpfRecord(rawSpf) {
  const descriptions = {
    'v': 'Versión del registro SPF',
    'ip4': 'Dirección IPv4 permitida',
    'ip6': 'Dirección IPv6 permitida',
    'include': 'Incluye el SPF de otro dominio',
    'a': 'Permite si la IP resuelve a un registro A/AAAA del dominio',
    'mx': 'Permite si la IP coincide con un registro MX',
    'ptr': 'Permite si la IP tiene un PTR válido',
    'exists': 'Permite si el dominio existe (consulta DNS)',
    'redirect': 'Redirige la evaluación a otro dominio',
    'exp': 'Mensaje explicativo si falla',
    'all': 'Regla final de coincidencia',
    '-all': 'Rechaza todos los demás',
    '~all': 'Softfail (puede marcar como spam)',
    '?all': 'Neutral (sin acción)',
    '+all': 'Permite todo (no recomendado)',
  };

  const partes = rawSpf.trim().split(/\s+/);

 return partes.map(part => {
  let campo = part;
  let valor = '';

  if (part.startsWith('v=spf1')) {
    campo = 'v';
    valor = 'spf1';
  } else if (part.includes(':')) {
    [campo, valor] = part.split(':');
  } else if (part.includes('=')) {
    [campo, valor] = part.split('=');
  }

  return {
    campo,
    valor,
    descripcion: descriptions[campo] || 'Mecanismo no reconocido'
  };
});
}




async function SPFRecordService(domain) {

    const raw = await getSPFRecord(domain);

    const objectSPF= parseSpfRecord(raw.data? raw.data[0] : ''); // Solo analizamos el primer registro SPF si hay varios

     return {
    success: raw.success,
    message: raw.message,
    data: objectSPF, // Devuelve el registro DMARC como objeto {Campo, Valor, Descripcion
    error:raw.error
  };

  }

module.exports = {SPFRecordService};


