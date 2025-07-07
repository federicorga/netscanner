const dns = require('dns').promises;
const chalk = require('chalk');
const { printCustomTable } = require('../../utils/table');

async function getDMARCRecord(domain) {
  try {
    const dmarcDomain = `_dmarc.${domain}`;
    const records = await dns.resolveTxt(dmarcDomain);
    const dmarcRecord = records
      .map(r => r.join(''))
      .find(txt => txt.startsWith('v=DMARC1'));
    return dmarcRecord || null;
  } catch {
    return null;
  }
};

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
}


async function DMARCRecordService(domain) {
  const raw = await getDMARCRecord(domain);
  if (!raw) {
    console.log(`❌ No se encontró registro DMARC para ${domain}`);
    return;
  }

  const tabla = parseDMARCRecord(raw);

  printCustomTable(tabla, {
    headerColor: chalk.gray,
    campoColor: chalk.magenta,
    valor: chalk.white,
  });
}

module.exports = { DMARCRecordService };

