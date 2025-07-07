const { printCustomTable } = require('../../utils/table');

const dns = require('dns').promises;
const chalk = require('chalk');

async function getSPFRecord(domain) {
  try {
    const records = await dns.resolveTxt(domain);
    
    const spfRecords = records
      .map(txtArray => txtArray.join('')) // Unir fragmentos
      .filter(record => record.startsWith('v=spf1'));
if(spfRecords === null){
  null
}
    return spfRecords[0] ;
  } catch (error) {
    return console.error(`❗[Error] al obtener el registro SPF para ${domain}:`, error);
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
  const rawSpf = await getSPFRecord(domain);

  if (!rawSpf) {
    console.log(`❌ No se encontró registro SPF para ${domain}`);
  } else {
    // Transformamos para que printCustomTable reciba las keys que espera
    const table = parseSpfRecord(rawSpf).map(item => ({
      Campo: item.campo,
      Valor: item.valor,
      Descripción: item.descripcion
    }));
console.log("\n")
printCustomTable(table);
  }
};

module.exports = {SPFRecordService};


